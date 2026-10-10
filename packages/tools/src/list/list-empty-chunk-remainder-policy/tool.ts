import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly itemCount: number;
  readonly chunkSize: number;
  readonly includeFinalEmptyChunk: boolean;
};
export type Output = {
  readonly fullChunks: number;
  readonly remainderItems: number;
  readonly outputChunkCount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    itemCount: { type: "integer", minimum: 0 },
    chunkSize: { type: "integer", minimum: 1 },
    includeFinalEmptyChunk: { type: "boolean" },
  },
  required: ["itemCount", "chunkSize", "includeFinalEmptyChunk"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fullChunks: { type: "integer" },
    remainderItems: { type: "integer" },
    outputChunkCount: { type: "integer" },
  },
  required: ["fullChunks", "remainderItems", "outputChunkCount"],
} as const;
/** Count fixed-size list chunks under an explicit policy for appending an empty final chunk after exact division. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { itemCount, chunkSize, includeFinalEmptyChunk } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(itemCount) &&
        itemCount >= 0 &&
        itemCount <= Number.MAX_SAFE_INTEGER,
      "itemCount",
    ),
      itemCount);
    (H.domain(
      Number.isSafeInteger(chunkSize) &&
        chunkSize >= 1 &&
        chunkSize <= Number.MAX_SAFE_INTEGER,
      "chunkSize",
    ),
      chunkSize);
    return {
      fullChunks: Math.floor(itemCount / chunkSize),
      remainderItems: itemCount % chunkSize,
      outputChunkCount:
        Math.floor(itemCount / chunkSize) +
        (itemCount % chunkSize > 0 || includeFinalEmptyChunk ? 1 : 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { itemCount: 10, chunkSize: 5, includeFinalEmptyChunk: true },
  output: { fullChunks: 2, remainderItems: 0, outputChunkCount: 3 },
} satisfies ToolExample<Input, Output>;
export const listEmptyChunkRemainderPolicyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["list", "computer science"],
      keywords: ["list", "computer science"],
    },
    id: "list/list-empty-chunk-remainder-policy",
    title: "List Empty Chunk Remainder Policy",
    description:
      "Count fixed-size list chunks under an explicit policy for appending an empty final chunk after exact division.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        itemCount: { type: "integer", minimum: 0 },
        chunkSize: { type: "integer", minimum: 1 },
        includeFinalEmptyChunk: { type: "boolean" },
      },
      required: ["itemCount", "chunkSize", "includeFinalEmptyChunk"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fullChunks: { type: "integer" },
        remainderItems: { type: "integer" },
        outputChunkCount: { type: "integer" },
      },
      required: ["fullChunks", "remainderItems", "outputChunkCount"],
    },
    ports: {
      inputs: [
        {
          id: "itemCount",
          label: "Item Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "chunkSize",
          label: "Chunk Size",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "includeFinalEmptyChunk",
          label: "Include Final Empty Chunk",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "fullChunks",
          label: "Full Chunks",
          valueType: { type: "integer" },
        },
        {
          id: "remainderItems",
          label: "Remainder Items",
          valueType: { type: "integer" },
        },
        {
          id: "outputChunkCount",
          label: "Output Chunk Count",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = listEmptyChunkRemainderPolicyTool.execute;
export default listEmptyChunkRemainderPolicyTool;
