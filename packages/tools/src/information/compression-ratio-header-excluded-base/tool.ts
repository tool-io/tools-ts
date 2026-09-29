import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly original: number;
  readonly stored: number;
  readonly header: number;
};
export type Output = { readonly payload: number; readonly ratio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    original: { type: "integer", minimum: 1 },
    stored: { type: "integer", minimum: 1 },
    header: { type: "integer", minimum: 0 },
  },
  required: ["original", "stored", "header"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { payload: { type: "integer" }, ratio: { type: "number" } },
  required: ["payload", "ratio"],
} as const;
/** Calculate compression ratio header excluded base from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { original, stored, header } = input;
  const compute = (): Output => {
    H.integer(original, 1);
    H.integer(stored, 1);
    H.integer(header, 0, stored - 1);
    const payload = stored - header;
    return { payload, ratio: original / payload };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { original: 1000, stored: 120, header: 20 },
  output: { payload: 100, ratio: 10 },
} satisfies ToolExample<Input, Output>;
export const compressionRatioHeaderExcludedBaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "information/compression-ratio-header-excluded-base",
    title: "Compression Ratio Header Excluded Base Tool",
    description:
      "Calculate compression ratio header excluded base from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        original: { type: "integer", minimum: 1 },
        stored: { type: "integer", minimum: 1 },
        header: { type: "integer", minimum: 0 },
      },
      required: ["original", "stored", "header"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { payload: { type: "integer" }, ratio: { type: "number" } },
      required: ["payload", "ratio"],
    },
    ports: {
      inputs: [
        {
          id: "original",
          label: "Original",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "stored",
          label: "Stored",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "header",
          label: "Header",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "payload", label: "Payload", valueType: { type: "integer" } },
        { id: "ratio", label: "Ratio", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = compressionRatioHeaderExcludedBaseTool.execute;
export default compressionRatioHeaderExcludedBaseTool;
