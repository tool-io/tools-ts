import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recorded: number;
  readonly recalled: number;
  readonly missing: number;
  readonly includeRecall: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly recallShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recorded: { type: "integer", minimum: 0 },
    recalled: { type: "integer", minimum: 0 },
    missing: { type: "integer", minimum: 0 },
    includeRecall: { type: "boolean" },
  },
  required: ["recorded", "recalled", "missing", "includeRecall"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer" },
    recallShare: { type: "number" },
  },
  required: ["denominator", "recallShare"],
} as const;
/** Supplied diary-record denominator, separating recalled and missing entries without clinical interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recorded, recalled, missing, includeRecall } = request;
  const compute = (): Output => {
    H.integer(recorded, 0);
    H.domain(recorded + recalled + missing > 0);
    H.integer(recalled, 0);
    H.integer(missing, 0);
    return {
      denominator: recorded + (includeRecall ? recalled : 0),
      recallShare: recalled / (recorded + recalled + missing),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recorded: 8, recalled: 2, missing: 2, includeRecall: true },
  output: { denominator: 10, recallShare: 0.16666666666666666 },
} satisfies ToolExample<Input, Output>;
export const caregiverDiaryRecallBaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geriatrics/caregiver-diary-recall-base",
    title: "Caregiver Diary Recall Base Tool",
    description:
      "Supplied diary-record denominator, separating recalled and missing entries without clinical interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recorded: { type: "integer", minimum: 0 },
        recalled: { type: "integer", minimum: 0 },
        missing: { type: "integer", minimum: 0 },
        includeRecall: { type: "boolean" },
      },
      required: ["recorded", "recalled", "missing", "includeRecall"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominator: { type: "integer" },
        recallShare: { type: "number" },
      },
      required: ["denominator", "recallShare"],
    },
    ports: {
      inputs: [
        {
          id: "recorded",
          label: "Recorded",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "recalled",
          label: "Recalled",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "missing",
          label: "Missing",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "includeRecall",
          label: "Include Recall",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "denominator",
          label: "Denominator",
          valueType: { type: "integer" },
        },
        {
          id: "recallShare",
          label: "Recall Share",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = caregiverDiaryRecallBaseTool.execute;
export default caregiverDiaryRecallBaseTool;
