import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly outcomeId: string;
  readonly raterId: string;
  readonly reportedBlindingStatus: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outcomeId: { type: "string", maxLength: 8192, minLength: 1 },
    raterId: { type: "string", maxLength: 8192, minLength: 1 },
    reportedBlindingStatus: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["outcomeId", "raterId", "reportedBlindingStatus"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit outcome-rater blinding status without verifying successful blinding. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { outcomeId, raterId, reportedBlindingStatus } = request;
  const compute = (): Output => {
    H.domain(outcomeId.length > 0, "outcomeId");
    H.domain(raterId.length > 0, "raterId");
    H.domain(reportedBlindingStatus.length > 0, "reportedBlindingStatus");
    return {
      token: JSON.stringify([outcomeId, raterId, reportedBlindingStatus]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    outcomeId: "O17",
    raterId: "R2",
    reportedBlindingStatus: "blinded record",
  },
  output: { token: '["O17","R2","blinded record"]' },
} satisfies ToolExample<Input, Output>;
export const trialOutcomeBlindingTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "clinical-trials",
        "clinical trials",
        "research and quality management",
      ],
      keywords: ["clinical trials", "research and quality management"],
    },
    id: "clinical-trials/trial-outcome-blinding-tag",
    title: "Trial Outcome Blinding Tag",
    description:
      "Preserve explicit outcome-rater blinding status without verifying successful blinding.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        outcomeId: { type: "string", maxLength: 8192, minLength: 1 },
        raterId: { type: "string", maxLength: 8192, minLength: 1 },
        reportedBlindingStatus: {
          type: "string",
          maxLength: 8192,
          minLength: 1,
        },
      },
      required: ["outcomeId", "raterId", "reportedBlindingStatus"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "outcomeId",
          label: "Outcome Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "raterId",
          label: "Rater Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "reportedBlindingStatus",
          label: "Reported Blinding Status",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = trialOutcomeBlindingTagTool.execute;
export default trialOutcomeBlindingTagTool;
