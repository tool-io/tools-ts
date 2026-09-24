import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly rowTotal: number;
  readonly columnTotal: number;
  readonly total: number;
};
export type Output = { readonly expected: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rowTotal: { type: "integer", minimum: 0 },
    columnTotal: { type: "integer", minimum: 0 },
    total: { type: "integer", minimum: 1 },
  },
  required: ["rowTotal", "columnTotal", "total"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { expected: { type: "number" } },
  required: ["expected"],
} as const;
/** Compute confusion cell expected independence term from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { rowTotal, columnTotal, total } = input;
  const compute = (): Output => {
    integer(total, 1);
    integer(rowTotal, 0, total);
    integer(columnTotal, 0, total);
    return { expected: (rowTotal * columnTotal) / total };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { rowTotal: 4, columnTotal: 5, total: 10 },
  output: { expected: 2 },
} satisfies ToolExample<Input, Output>;
export const confusionCellExpectedIndependenceTermTool =
  defineSchemaCalculation<Input, Output>({
    id: "classification/confusion-cell-expected-independence-term",
    title: "Confusion Cell Expected Independence Term Tool",
    description:
      "Compute confusion cell expected independence term from explicit bounded inputs.",
    calculate,
    inputSchema,
    outputSchema,
    ports: {
      inputs: [
        {
          id: "rowTotal",
          label: "Row Total",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "columnTotal",
          label: "Column Total",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "total",
          label: "Total",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "expected", label: "Expected", valueType: { type: "number" } },
      ],
    },
  });
export const run = confusionCellExpectedIndependenceTermTool.execute;
export default confusionCellExpectedIndependenceTermTool;
