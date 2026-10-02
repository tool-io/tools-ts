import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly copyCounts: readonly number[];
  readonly suppliedActivities: readonly number[];
};
export type Output = {
  readonly totalCopies: number;
  readonly activitySum: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    copyCounts: { type: "array", maxItems: 256, items: { type: "integer" } },
    suppliedActivities: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
  },
  required: ["copyCounts", "suppliedActivities"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalCopies: { type: "integer" },
    activitySum: { type: "number" },
  },
  required: ["totalCopies", "activitySum"],
} as const;
/** Sum explicitly supplied allele-copy activities without choosing phenotype or treatment rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { copyCounts, suppliedActivities } = request;
  const compute = (): Output => {
    H.sameLength(copyCounts, suppliedActivities);
    H.domain(
      copyCounts.every((x) => x >= 0) &&
        suppliedActivities.every((x) => x >= 0),
    );
    return {
      totalCopies: copyCounts.reduce((a, b) => a + b, 0),
      activitySum: H.dot(copyCounts, suppliedActivities),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { copyCounts: [1, 2], suppliedActivities: [1, 0.5] },
  output: { totalCopies: 3, activitySum: 2 },
} satisfies ToolExample<Input, Output>;
export const pharmacogenomicResultActivitySuppliedSumTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "pharmacogenomics/pharmacogenomic-result-activity-supplied-sum",
      title: "Pharmacogenomic Result Activity Supplied Sum Tool",
      description:
        "Sum explicitly supplied allele-copy activities without choosing phenotype or treatment rules.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          copyCounts: {
            type: "array",
            maxItems: 256,
            items: { type: "integer" },
          },
          suppliedActivities: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
        },
        required: ["copyCounts", "suppliedActivities"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          totalCopies: { type: "integer" },
          activitySum: { type: "number" },
        },
        required: ["totalCopies", "activitySum"],
      },
      ports: {
        inputs: [
          {
            id: "copyCounts",
            label: "Copy Counts",
            required: true,
            valueType: { type: "list", items: { type: "integer" } },
          },
          {
            id: "suppliedActivities",
            label: "Supplied Activities",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
        ],
        outputs: [
          {
            id: "totalCopies",
            label: "Total Copies",
            valueType: { type: "integer" },
          },
          {
            id: "activitySum",
            label: "Activity Sum",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = pharmacogenomicResultActivitySuppliedSumTool.execute;
export default pharmacogenomicResultActivitySuppliedSumTool;
