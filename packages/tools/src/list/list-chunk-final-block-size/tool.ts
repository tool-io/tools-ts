import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly length: number; readonly size: number };
export type Output = { readonly chunks: number; readonly finalSize: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    length: { type: "integer", minimum: 0 },
    size: { type: "integer", minimum: 1 },
  },
  required: ["length", "size"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { chunks: { type: "integer" }, finalSize: { type: "integer" } },
  required: ["chunks", "finalSize"],
} as const;
/** Calculate list chunk final block size from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { length, size } = input;
  const compute = (): Output => {
    H.integer(length, 0);
    H.integer(size, 1);
    return {
      chunks: Math.ceil(length / size),
      finalSize: length === 0 ? 0 : ((length - 1) % size) + 1,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { length: 10, size: 4 },
  output: { chunks: 3, finalSize: 2 },
} satisfies ToolExample<Input, Output>;
export const listChunkFinalBlockSizeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "list/list-chunk-final-block-size",
    title: "List Chunk Final Block Size Tool",
    description:
      "Calculate list chunk final block size from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        length: { type: "integer", minimum: 0 },
        size: { type: "integer", minimum: 1 },
      },
      required: ["length", "size"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        chunks: { type: "integer" },
        finalSize: { type: "integer" },
      },
      required: ["chunks", "finalSize"],
    },
    ports: {
      inputs: [
        {
          id: "length",
          label: "Length",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "size",
          label: "Size",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "chunks", label: "Chunks", valueType: { type: "integer" } },
        {
          id: "finalSize",
          label: "Final Size",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = listChunkFinalBlockSizeTool.execute;
export default listChunkFinalBlockSizeTool;
