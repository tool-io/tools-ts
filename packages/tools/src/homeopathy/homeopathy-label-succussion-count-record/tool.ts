import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly counts: readonly number[];
  readonly labelStages: number;
  readonly missingStages: readonly number[];
};
export type Output = {
  readonly recordedTotal: number;
  readonly recordedStages: number;
  readonly missingCount: number;
  readonly stageCountMatches: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    counts: { type: "array", maxItems: 256, items: { type: "integer" } },
    labelStages: { type: "integer", minimum: 0 },
    missingStages: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["counts", "labelStages", "missingStages"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedTotal: { type: "integer" },
    recordedStages: { type: "integer" },
    missingCount: { type: "integer" },
    stageCountMatches: { type: "boolean" },
  },
  required: [
    "recordedTotal",
    "recordedStages",
    "missingCount",
    "stageCountMatches",
  ],
} as const;
/** Audit supplied label process-count records without efficacy inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { counts, labelStages, missingStages } = request;
  const compute = (): Output => {
    H.integer(labelStages, 0);
    H.domain(
      counts.every((x) => x >= 0) &&
        new Set(missingStages).size === missingStages.length &&
        missingStages.every((x) => x >= 0 && x < labelStages),
    );
    return {
      recordedTotal: counts.reduce((a, b) => a + b, 0),
      recordedStages: counts.length,
      missingCount: missingStages.length,
      stageCountMatches: counts.length + missingStages.length === labelStages,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { counts: [10, 20, 10], labelStages: 4, missingStages: [2] },
  output: {
    recordedTotal: 40,
    recordedStages: 3,
    missingCount: 1,
    stageCountMatches: true,
  },
} satisfies ToolExample<Input, Output>;
export const homeopathyLabelSuccussionCountRecordTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "homeopathy/homeopathy-label-succussion-count-record",
      title: "Homeopathy Label Succussion Count Record Tool",
      description:
        "Audit supplied label process-count records without efficacy inference.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          counts: { type: "array", maxItems: 256, items: { type: "integer" } },
          labelStages: { type: "integer", minimum: 0 },
          missingStages: {
            type: "array",
            maxItems: 256,
            items: { type: "integer" },
          },
        },
        required: ["counts", "labelStages", "missingStages"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          recordedTotal: { type: "integer" },
          recordedStages: { type: "integer" },
          missingCount: { type: "integer" },
          stageCountMatches: { type: "boolean" },
        },
        required: [
          "recordedTotal",
          "recordedStages",
          "missingCount",
          "stageCountMatches",
        ],
      },
      ports: {
        inputs: [
          {
            id: "counts",
            label: "Counts",
            required: true,
            valueType: { type: "list", items: { type: "integer" } },
          },
          {
            id: "labelStages",
            label: "Label Stages",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "missingStages",
            label: "Missing Stages",
            required: true,
            valueType: { type: "list", items: { type: "integer" } },
          },
        ],
        outputs: [
          {
            id: "recordedTotal",
            label: "Recorded Total",
            valueType: { type: "integer" },
          },
          {
            id: "recordedStages",
            label: "Recorded Stages",
            valueType: { type: "integer" },
          },
          {
            id: "missingCount",
            label: "Missing Count",
            valueType: { type: "integer" },
          },
          {
            id: "stageCountMatches",
            label: "Stage Count Matches",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = homeopathyLabelSuccussionCountRecordTool.execute;
export default homeopathyLabelSuccussionCountRecordTool;
