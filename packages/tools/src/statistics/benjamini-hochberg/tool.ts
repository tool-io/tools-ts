import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
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

export type BenjaminiHochbergInput = {
  readonly pValues: readonly number[] | number | string;
};
export type BenjaminiHochbergOutput = {
  readonly adjustedPValues: readonly number[];
};

export const benjaminiHochbergExample = {
  input: { pValues: [0.01, 0.04, 0.03] },
} satisfies ToolExample<BenjaminiHochbergInput>;

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
  execution: { kind: "pure" },
  id: "statistics/benjamini-hochberg",
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
  title: "Benjamini-Hochberg FDR Calculator",
});
export default benjaminiHochbergTool;
