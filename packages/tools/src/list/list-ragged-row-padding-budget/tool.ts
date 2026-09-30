import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly lengths: readonly number[] };
export type Output = {
  readonly width: number;
  readonly perRow: readonly number[];
  readonly total: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lengths: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["lengths"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    width: { type: "integer" },
    perRow: { type: "array", maxItems: 256, items: { type: "integer" } },
    total: { type: "integer" },
  },
  required: ["width", "perRow", "total"],
} as const;
/** Compute list ragged row padding budget from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { lengths } = input;
  const compute = (): Output => {
    domain(lengths.every((x) => x >= 0));
    const width = Math.max(0, ...lengths),
      perRow = lengths.map((x) => width - x);
    return { width, perRow, total: perRow.reduce((a, b) => a + b, 0) };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { lengths: [2, 4, 1] },
  output: { width: 4, perRow: [2, 0, 3], total: 5 },
} satisfies ToolExample<Input, Output>;
export const listRaggedRowPaddingBudgetTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "list/list-ragged-row-padding-budget",
  title: "List Ragged Row Padding Budget Tool",
  description:
    "Compute list ragged row padding budget from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "lengths",
        label: "Lengths",
        required: true,
        valueType: { type: "list", items: { type: "integer" } },
      },
    ],
    outputs: [
      { id: "width", label: "Width", valueType: { type: "integer" } },
      {
        id: "perRow",
        label: "Per Row",
        valueType: { type: "list", items: { type: "integer" } },
      },
      { id: "total", label: "Total", valueType: { type: "integer" } },
    ],
  },
});
export const run = listRaggedRowPaddingBudgetTool.execute;
export default listRaggedRowPaddingBudgetTool;
