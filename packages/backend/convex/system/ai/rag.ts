// import { google } from "@ai-sdk/google";
// import { RAG } from "@convex-dev/rag";
// import { components } from "../../_generated/api";

// // Define the embedding model
// const model = google.textEmbedding("gemini-embedding-001", {
//   outputDimensionality: 3072,
//   taskType: "SEMANTIC_SIMILARITY",
// });

// // Wrap it with RAG
// const rag = new RAG(components.rag, {
//   textEmbeddingModel: model as any,
//   embeddingDimension: 3072,
// });

// export default rag


import { google } from "@ai-sdk/google";
import { RAG } from "@convex-dev/rag";
import { components } from "../../_generated/api";

const rag = new RAG(components.rag, {
  textEmbeddingModel: google.textEmbedding("gemini-embedding-001") as any,
  embeddingDimension: 3072, // matches outputDimensionality
});

export default rag;


// import { RAG } from "@convex-dev/rag";
// import { components } from "../../_generated/api";
// import { GoogleGenAI } from "@google/genai";

// // Initialize Google GenAI client
// const genAI = new GoogleGenAI({
//   // Add your API key here or use environment variables
//   apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY
// });

// // Create a custom embedding function that matches the RAG interface

// // Create a custom embedding function that matches the RAG interface
// const googleEmbeddingFunction = {
//   async embed(texts: string[]): Promise<number[][]> {
//     const response = await genAI.models.embedContent({
//       model: 'gemini-embedding-001',
//       contents: texts,
//     });
    
//     if (!response || !response.embeddings) {
//       throw new Error('Failed to generate embeddings: Invalid response from Google AI API');
//     }
    
//     // Extract and return the embeddings
//     return response.embeddings.map(embedding => 
//       Array.isArray(embedding) ? embedding : embedding.values
//     ) as number[][];
//   },
  
//   // This is required by the RAG interface
//   async embedQuery(text: string): Promise<number[]> {
//     const [embedding] = await this.embed([text]);
//     return embedding;
//   }
// };

// // Configure RAG with the custom embedding function
// const rag = new RAG(components.rag, {
//   textEmbeddingModel: googleEmbeddingFunction as any,
//   embeddingDimension: 768, // Default dimension for gemini-embedding-001
// });

// export default rag;