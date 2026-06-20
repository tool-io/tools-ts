import { defineTool } from "../../core/definition.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { datasetNumberType } from "../../core/semantic-type.js";
import { isRecord, pValues, roundStatistic } from "../input.js";

export type HolmBonferroniInput = {
  readonly pValues: readonly number[] | number | string;
};
export type HolmBonferroniOutput = {
  readonly adjustedPValues: readonly number[];
};
export const calculateHolmBonferroni = (
  input: unknown,
): ToolResult<HolmBonferroniOutput> => {
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
  let previous = 0;
  ordered.forEach((entry, rank) => {
    previous = Math.max(
      previous,
      Math.min(1, (values.length - rank) * entry.value),
    );
    adjusted[entry.index] = roundStatistic(previous);
  });
  return toolSuccess({ adjustedPValues: adjusted });
};
export const holmBonferroniTool = defineTool<
  HolmBonferroniInput,
  HolmBonferroniOutput
>({
  contractVersion: 1,
  description:
    "Adjust a family of p-values using the step-down Holm-Bonferroni procedure.",
  execute: calculateHolmBonferroni,
  executionKind: "pure",
  id: "statistics/holm-bonferroni",
  inputSchema: { type: "object" },
  isOutput: (value): value is HolmBonferroniOutput =>
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
  title: "Holm-Bonferroni P-Value Adjustment",
});
export default holmBonferroniTool;
