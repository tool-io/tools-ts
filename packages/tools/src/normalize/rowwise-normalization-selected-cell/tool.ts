import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  integer,
  positive,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly row: readonly number[]; readonly index: number };
export type Output = { readonly value: number; readonly denominator: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    row: { type: "array", maxItems: 256, items: { type: "number" } },
    index: { type: "integer", minimum: 0 },
  },
  required: ["row", "index"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { value: { type: "number" }, denominator: { type: "number" } },
  required: ["value", "denominator"],
} as const;
/** Compute rowwise normalization selected cell from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { row, index } = input;
  const compute = (): Output => {
    integer(index, 0, row.length - 1);
    domain(row.every((x) => x >= 0));
    const denominator = row.reduce((a, b) => a + b, 0);
    positive(denominator);
    return { value: row[index] / denominator, denominator };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { row: [1, 3], index: 1 },
  output: { value: 0.75, denominator: 4 },
} satisfies ToolExample<Input, Output>;
export const rowwiseNormalizationSelectedCellTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "normalize/rowwise-normalization-selected-cell",
  title: "Rowwise Normalization Selected Cell Tool",
  description:
    "Compute rowwise normalization selected cell from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "row",
        label: "Row",
        required: true,
        valueType: { type: "list", items: { type: "number" } },
      },
      {
        id: "index",
        label: "Index",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "value", label: "Value", valueType: { type: "number" } },
      {
        id: "denominator",
        label: "Denominator",
        valueType: { type: "number" },
      },
    ],
  },
});
export const run = rowwiseNormalizationSelectedCellTool.execute;
export default rowwiseNormalizationSelectedCellTool;
