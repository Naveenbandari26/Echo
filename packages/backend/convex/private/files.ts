import { ConvexError, v } from "convex/values";
import { action, mutation, query, QueryCtx } from "../_generated/server";
import {
  contentHashFromArrayBuffer,
  guessMimeTypeFromContents,
  guessMimeTypeFromExtension,
  vEntryId,
  Entry,EntryId
} from "@convex-dev/rag";
import { extractTextContent } from "../lib/extractTextContent";
import rag from "../system/ai/rag";
import { Id } from "../_generated/dataModel";
import { paginationOptsValidator } from "convex/server";

function guessMimiType(fileName: string, bytes: ArrayBuffer): string {
  return (
    guessMimeTypeFromContents(bytes) ||
    guessMimeTypeFromExtension(fileName) ||
    "application/octet-stream"
  );
}

export const addFile = action({
  args: {
    fileName: v.string(),
    mimeType: v.string(),
    bytes: v.bytes(),
    category: v.optional(v.string()),
  },
  handler: async (context, args) => {
    const identity = await context.auth.getUserIdentity();
    if (identity === null) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Identity not found",
      });
    }

    const orgId = identity.orgId as string;
    if (!orgId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Organization not found",
      });
    }

    const { bytes, fileName, category } = args;
    const mimeType = args.mimeType || guessMimiType(fileName, bytes);

    const blob = new Blob([bytes], { type: mimeType });

    const storageId = await context.storage.store(blob);

    const text = await extractTextContent(context, {
      storageId,
      bytes,
      filename: fileName,
      mimeType,
    });

    const { entryId, created } = await rag.add(context, {
      namespace: orgId,
      text,
      key: fileName,
      metadata: {
        storageId,
        uploadedBy: orgId,
        fileName,
        category: category ?? null,
      },
      contentHash: await contentHashFromArrayBuffer(bytes),
    });

    if (!created) {
      console.debug("entry already exists , skipping uplaod metadata");
      await context.storage.delete(storageId);
    }

    console.log(entryId)
    return {
      url: await context.storage.getUrl(storageId),
      entryId,
    };
  },
});

export const deleteFile = mutation({
  args: {
    entryId: vEntryId,
  },
  handler: async (context, args) => {
    const identity = await context.auth.getUserIdentity();
    if (identity === null) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Identity not found",
      });
    }

    const orgId = identity.orgId as string;
    if (!orgId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Organization not found",
      });
    }

    const namespace=await rag.getNamespace(context,{
        namespace:orgId
    })

    if(!namespace){
        throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Invalid namespace",
      });
    }

    const entry =await rag.getEntry(context,{
        entryId:args.entryId
    })

    if(!entry){
        throw new ConvexError({
        code: "NOT_FOUND",
        message: "Entry not found",
      });
    }

    if(entry.metadata?.uploadedBy!==orgId){
        throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Invalid Organization Id",
    })
    }

    if(entry.metadata?.storageId){
        await context.storage.delete(entry.metadata.storageId as Id<"_storage">)
    }   

    await rag.deleteAsync(context,{
        entryId: args.entryId
    })

  },
});


export const list =query({
  args:{
    category: v.optional(v.string()),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (context,args)=>{
     const identity = await context.auth.getUserIdentity();
    if (identity === null) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Identity not found",
      });
    }

    const orgId = identity.orgId as string;
    if (!orgId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Organization not found",
      });
    }

    const namespace=await rag.getNamespace(context,{
      namespace:orgId,
    });

    if(!namespace){
      return {page:[],isDone:true,continueCursor:""};
    }

    const results=await rag.list(context,{
      namespaceId:namespace.namespaceId,
      paginationOpts:args.paginationOpts,
    })

    const files= await Promise.all(
      results.page.map((entry)=> convertEntryToPublicFile(context,entry))
    );


    const FilteredFiles=args.category
    ? files.filter((file)=> file.category ===args.category)
    :files;

    return {
      page:FilteredFiles,
      isDone:results.isDone,
      continueCursor:results.continueCursor,
    }
  }
})

export type PublicFile = {
  id: EntryId,
  name: string;
  type: string;
  size: string;
  status: "ready" | "processing" | "error";
  url: string | null;
  category?: string;
};

type EntryMetadata = {
  storageId: Id<"_storage">;
  uploadedBy: string;
  filename: string;
  category: string | null;
};

async function convertEntryToPublicFile(
  ctx: QueryCtx,
  entry:Entry,
): Promise<PublicFile> {
  const metadata = entry.metadata as EntryMetadata | undefined;
  const storageId = metadata?.storageId;

  let fileSize = "unknown";

  if (storageId) {
    try {
      const storageMetadata = await ctx.db.system.get(storageId);
      if (storageMetadata) {
        fileSize = formatFileSize(storageMetadata.size);
      }
    } catch (error) {
      console.error("Failed to get storage metadata: ", error);
    }
  }

  const filename = entry.key || "Unknown";
  const extension = filename.split(".").pop()?.toLowerCase() || "txt";

  let status: "ready" | "processing" | "error" = "error";
  if (entry.status === "ready") {
    status = "ready"
  } else if (entry.status === "pending") {
    status = "processing"
  }

  const url = storageId ? await ctx.storage.getUrl(storageId) : null;

  return {
    id: entry.entryId,
    name: filename,
    type: extension,
    size: fileSize,
    status,
    url,
    category: metadata?.category || undefined,
  };
};

function formatFileSize(bytes: number): string {
  if (bytes === 0) {
    return "0 B";
  }

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${Number.parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`;
};



