import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly actual: number;
  readonly predicted: number;
  readonly classes: number;
  readonly squared: boolean;
};
export type Output = { readonly cost: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    actual: { type: "integer", minimum: 0 },
    predicted: { type: "integer", minimum: 0 },
    classes: { type: "integer", minimum: 2, maximum: 1000000 },
    squared: { type: "boolean" },
  },
  required: ["actual", "predicted", "classes", "squared"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { cost: { type: "number" } },
  required: ["cost"],
} as const;
/** Compute ordinal label cost matrix cell from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { actual, predicted, classes, squared } = input;
  const compute = (): Output => {
    integer(classes, 2, 1000000);
    integer(actual, 0, classes - 1);
    integer(predicted, 0, classes - 1);
    const d = Math.abs(actual - predicted);
    return { cost: squared ? d * d : d };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { actual: 1, predicted: 4, classes: 5, squared: true },
  output: { cost: 9 },
} satisfies ToolExample<Input, Output>;
export const ordinalLabelCostMatrixCellTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "classification/ordinal-label-cost-matrix-cell",
  title: "Ordinal Label Cost Matrix Cell Tool",
  description:
    "Compute ordinal label cost matrix cell from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "actual",
        label: "Actual",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "predicted",
        label: "Predicted",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "classes",
        label: "Classes",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "squared",
        label: "Squared",
        required: true,
        valueType: { type: "boolean" },
      },
    ],
    outputs: [{ id: "cost", label: "Cost", valueType: { type: "number" } }],
  },
});
export const run = ordinalLabelCostMatrixCellTool.execute;
export default ordinalLabelCostMatrixCellTool;
