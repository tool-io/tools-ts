import { defineTool } from "../../core/definition.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { datasetNumberType } from "../../core/semantic-type.js";
import { isRecord, pValues, roundStatistic } from "../input.js";

export type BenjaminiHochbergInput = {
  readonly pValues: readonly number[] | number | string;
};
export type BenjaminiHochbergOutput = {
  readonly adjustedPValues: readonly number[];
};
export const calculateBenjaminiHochberg = (
  input: unknown,
): ToolResult<BenjaminiHochbergOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);
  const values = pValues(input.pValues);
  if (!values?.length)
    return invalidInput([
      {
        code: "p_values_required",
        field: "pValues",
        message: "Provide p-values between zero and one.",
      },
    ]);
  const ordered = values
    .map((value, index) => ({ index, value }))
    .sort((a, b) => a.value - b.value || a.index - b.index);
  const adjusted = new Array<number>(values.length);
  let next = 1;
  for (let index = ordered.length - 1; index >= 0; index -= 1) {
    const entry = ordered[index]!;
    next = Math.min(next, (entry.value * values.length) / (index + 1));
    adjusted[entry.index] = roundStatistic(Math.min(1, next));
  }
  return toolSuccess({ adjustedPValues: adjusted });
};
export const benjaminiHochbergTool = defineTool<
  BenjaminiHochbergInput,
  BenjaminiHochbergOutput
>({
  contractVersion: 1,
  description:
    "Adjust p-values with the Benjamini-Hochberg false discovery rate procedure.",
  execute: calculateBenjaminiHochberg,
  executionKind: "pure",
  id: "statistics/benjamini-hochberg",
  inputSchema: { type: "object" },
  isOutput: (value): value is BenjaminiHochbergOutput =>
    isRecord(value) && Array.isArray(value.adjustedPValues),
  outputSchema: { type: "object" },
  ports: {
    inputs: [
      {
        id: "pValues",
        label: "P-values",
        required: true,
        type: datasetNumberType,
        valueType: {
          format: "probability",
          items: { format: "probability", type: "number" },
          type: "list",
        },
      },
    ],
    outputs: [
      {
        id: "adjustedPValues",
        label: "Adjusted p-values",
        path: ["adjustedPValues"],
        type: datasetNumberType,
        valueType: {
          format: "probability",
          items: { format: "probability", type: "number" },
          type: "list",
        },
      },
    ],
  },
  title: "Benjamini-Hochberg FDR Calculator",
});
export default benjaminiHochbergTool;
