import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly length: number; readonly requireEven: boolean };
export type Output = { readonly halfIndex: number; readonly odd: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    length: { type: "integer", minimum: 2 },
    requireEven: { type: "boolean" },
  },
  required: ["length", "requireEven"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { halfIndex: { type: "integer" }, odd: { type: "boolean" } },
  required: ["halfIndex", "odd"],
} as const;
/** Calculate dma circular buffer half transfer index from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { length, requireEven } = input;
  const compute = (): Output => {
    H.integer(length, 2);
    H.domain(!requireEven || length % 2 === 0);
    return { halfIndex: Math.floor(length / 2), odd: length % 2 !== 0 };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { length: 8, requireEven: true },
  output: { halfIndex: 4, odd: false },
} satisfies ToolExample<Input, Output>;
export const dmaCircularBufferHalfTransferIndexTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "microcontroller/dma-circular-buffer-half-transfer-index",
    title: "DMA Circular Buffer Half Transfer Index Tool",
    description:
      "Calculate dma circular buffer half transfer index from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        length: { type: "integer", minimum: 2 },
        requireEven: { type: "boolean" },
      },
      required: ["length", "requireEven"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { halfIndex: { type: "integer" }, odd: { type: "boolean" } },
      required: ["halfIndex", "odd"],
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
          id: "requireEven",
          label: "Require Even",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "halfIndex",
          label: "Half Index",
          valueType: { type: "integer" },
        },
        { id: "odd", label: "Odd", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = dmaCircularBufferHalfTransferIndexTool.execute;
export default dmaCircularBufferHalfTransferIndexTool;
