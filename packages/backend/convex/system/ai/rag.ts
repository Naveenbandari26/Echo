import { google } from "@ai-sdk/google";
import { RAG } from "@convex-dev/rag";
import { components } from "../../_generated/api";

// Define the embedding model
const model = google.textEmbedding("gemini-embedding-001", {
  outputDimensionality: 512,
  taskType: "SEMANTIC_SIMILARITY",
});

// Wrap it with RAG
const rag = new RAG(components.rag, {
  textEmbeddingModel: model as any,
  embeddingDimension: 512,
});

export default rag