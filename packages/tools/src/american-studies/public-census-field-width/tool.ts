import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly field: string;
  readonly countCodePoints: boolean;
  readonly suppliedMaximum: number;
};
export type Output = { readonly length: number; readonly excess: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    field: { type: "string", maxLength: 8192 },
    countCodePoints: { type: "boolean" },
    suppliedMaximum: { type: "integer", minimum: 0 },
  },
  required: ["field", "countCodePoints", "suppliedMaximum"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { length: { type: "integer" }, excess: { type: "integer" } },
  required: ["length", "excess"],
} as const;
/** Inspect one supplied public census field against an explicit character/code-unit width budget. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { field, countCodePoints, suppliedMaximum } = request;
  const compute = (): Output => {
    H.integer(suppliedMaximum, 0);
    const length = countCodePoints ? [...field].length : field.length;
    return { length, excess: Math.max(0, length - suppliedMaximum) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { field: "Town A", countCodePoints: true, suppliedMaximum: 5 },
  output: { length: 6, excess: 1 },
} satisfies ToolExample<Input, Output>;
export const publicCensusFieldWidthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "american-studies/public-census-field-width",
    title: "Public Census Field Width Tool",
    description:
      "Inspect one supplied public census field against an explicit character/code-unit width budget.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        field: { type: "string", maxLength: 8192 },
        countCodePoints: { type: "boolean" },
        suppliedMaximum: { type: "integer", minimum: 0 },
      },
      required: ["field", "countCodePoints", "suppliedMaximum"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { length: { type: "integer" }, excess: { type: "integer" } },
      required: ["length", "excess"],
    },
    ports: {
      inputs: [
        {
          id: "field",
          label: "Field",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "countCodePoints",
          label: "Count Code Points",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "suppliedMaximum",
          label: "Supplied Maximum",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "length", label: "Length", valueType: { type: "integer" } },
        { id: "excess", label: "Excess", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = publicCensusFieldWidthTool.execute;
export default publicCensusFieldWidthTool;
