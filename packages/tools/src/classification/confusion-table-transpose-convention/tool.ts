import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly counts: readonly (readonly number[])[];
  readonly rowsAreActual: boolean;
};
export type Output = {
  readonly actualRowsPredictedColumns: readonly (readonly number[])[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    counts: {
      type: "array",
      maxItems: 128,
      items: { type: "array", maxItems: 128, items: { type: "number" } },
    },
    rowsAreActual: { type: "boolean" },
  },
  required: ["counts", "rowsAreActual"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    actualRowsPredictedColumns: {
      type: "array",
      maxItems: 128,
      items: { type: "array", maxItems: 128, items: { type: "number" } },
    },
  },
  required: ["actualRowsPredictedColumns"],
} as const;
/** Normalize a square count confusion matrix into actual-row/predicted-column orientation using the caller's declared original convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { counts, rowsAreActual } = request;
  const compute = (): Output => {
    const n = counts.length;
    H.domain(n > 0 && counts.every((r) => r.length === n), "counts");
    counts.flat().forEach((v) => H.integer(v));
    return {
      actualRowsPredictedColumns: rowsAreActual
        ? counts
        : counts.map((_, i) => counts.map((r) => r[i])),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    counts: [
      [12, 3],
      [2, 8],
    ],
    rowsAreActual: false,
  },
  output: {
    actualRowsPredictedColumns: [
      [12, 2],
      [3, 8],
    ],
  },
} satisfies ToolExample<Input, Output>;
export const confusionTableTransposeConventionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "classification/confusion-table-transpose-convention",
    title: "Confusion Table Transpose Convention Tool",
    description:
      "Normalize a square count confusion matrix into actual-row/predicted-column orientation using the caller's declared original convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        counts: {
          type: "array",
          maxItems: 128,
          items: { type: "array", maxItems: 128, items: { type: "number" } },
        },
        rowsAreActual: { type: "boolean" },
      },
      required: ["counts", "rowsAreActual"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        actualRowsPredictedColumns: {
          type: "array",
          maxItems: 128,
          items: { type: "array", maxItems: 128, items: { type: "number" } },
        },
      },
      required: ["actualRowsPredictedColumns"],
    },
    ports: {
      inputs: [
        {
          id: "counts",
          label: "Counts",
          required: true,
          valueType: {
            type: "list",
            items: { type: "list", items: { type: "number" } },
          },
        },
        {
          id: "rowsAreActual",
          label: "Rows Are Actual",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "actualRowsPredictedColumns",
          label: "Actual Rows Predicted Columns",
          valueType: {
            type: "list",
            items: { type: "list", items: { type: "number" } },
          },
        },
      ],
    },
  },
  calculate,
});
export const run = confusionTableTransposeConventionTool.execute;
export default confusionTableTransposeConventionTool;
