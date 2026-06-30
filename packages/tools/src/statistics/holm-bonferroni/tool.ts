import { defineTool } from "../../core/definition.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import {
  isRecord,
  probabilityDatasetSchema,
  pValues,
  roundStatistic,
} from "../input.js";

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
  execution: { kind: "pure" },
  id: "statistics/holm-bonferroni",
  inputSchema: {
    additionalProperties: false,
    properties: { pValues: probabilityDatasetSchema },
    required: ["pValues"],
    type: "object",
  },
  outputSchema: {
    additionalProperties: false,
    properties: {
      adjustedPValues: {
        items: { maximum: 1, minimum: 0, type: "number" },
        type: "array",
      },
    },
    required: ["adjustedPValues"],
    type: "object",
  },
  ports: {
    inputs: [
      {
        id: "pValues",
        label: "P-values",
        required: true,
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
