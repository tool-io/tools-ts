import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly trialId: string;
  readonly practice: boolean;
  readonly excludePractice: boolean;
};
export type Output = { readonly excluded: boolean; readonly reason: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    trialId: { type: "string", maxLength: 8192, minLength: 1 },
    practice: { type: "boolean" },
    excludePractice: { type: "boolean" },
  },
  required: ["trialId", "practice", "excludePractice"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    excluded: { type: "boolean" },
    reason: { type: "string", maxLength: 8192 },
  },
  required: ["excluded", "reason"],
} as const;
/** Apply an explicit practice-trial exclusion switch without selecting an analysis rule. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { trialId, practice, excludePractice } = request;
  const compute = (): Output => {
    H.domain(trialId.length > 0, "trialId");
    return {
      excluded: practice && excludePractice,
      reason:
        practice && excludePractice
          ? "practice"
          : "included under supplied rule",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { trialId: "T17", practice: true, excludePractice: true },
  output: { excluded: true, reason: "practice" },
} satisfies ToolExample<Input, Output>;
export const practiceTrialExclusionLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "experimental-psychology",
        "experimental psychology",
        "psychology",
      ],
      keywords: ["experimental psychology", "psychology"],
    },
    id: "experimental-psychology/practice-trial-exclusion-label",
    title: "Practice Trial Exclusion Label",
    description:
      "Apply an explicit practice-trial exclusion switch without selecting an analysis rule.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        trialId: { type: "string", maxLength: 8192, minLength: 1 },
        practice: { type: "boolean" },
        excludePractice: { type: "boolean" },
      },
      required: ["trialId", "practice", "excludePractice"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        excluded: { type: "boolean" },
        reason: { type: "string", maxLength: 8192 },
      },
      required: ["excluded", "reason"],
    },
    ports: {
      inputs: [
        {
          id: "trialId",
          label: "Trial Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "practice",
          label: "Practice",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "excludePractice",
          label: "Exclude Practice",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "excluded", label: "Excluded", valueType: { type: "boolean" } },
        { id: "reason", label: "Reason", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = practiceTrialExclusionLabelTool.execute;
export default practiceTrialExclusionLabelTool;
