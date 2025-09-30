import { ConvexError, v } from "convex/values";
import { action, mutation } from "../_generated/server";
import {
  contentHashFromArrayBuffer,
  guessMimeTypeFromContents,
  guessMimeTypeFromExtension,
  vEntryId,
} from "@convex-dev/rag";
import { extractTextContent } from "../lib/extractTextContent";
import rag from "../system/ai/rag";
import { Id } from "../_generated/dataModel";

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
