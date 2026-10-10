import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly studyId: string;
  readonly cointerventionReported: boolean;
  readonly excludedByProtocol: boolean;
};
export type Output = { readonly requiresProtocolReview: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    studyId: { type: "string", maxLength: 8192, minLength: 1 },
    cointerventionReported: { type: "boolean" },
    excludedByProtocol: { type: "boolean" },
  },
  required: ["studyId", "cointerventionReported", "excludedByProtocol"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { requiresProtocolReview: { type: "boolean" } },
  required: ["requiresProtocolReview"],
} as const;
/** Combine explicit cointervention and exclusion flags without deciding trial eligibility or interpreting effects. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { studyId, cointerventionReported, excludedByProtocol } = request;
  const compute = (): Output => {
    H.domain(studyId.length > 0, "studyId");
    return {
      requiresProtocolReview: cointerventionReported && excludedByProtocol,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    studyId: "ST17",
    cointerventionReported: true,
    excludedByProtocol: true,
  },
  output: { requiresProtocolReview: true },
} satisfies ToolExample<Input, Output>;
export const osteopathicStudyCointerventionFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["osteopathy", "health and medicine"],
      keywords: ["osteopathy", "health and medicine"],
    },
    id: "osteopathy/osteopathic-study-cointervention-flag",
    title: "Osteopathic Study Cointervention Flag",
    description:
      "Combine explicit cointervention and exclusion flags without deciding trial eligibility or interpreting effects.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        studyId: { type: "string", maxLength: 8192, minLength: 1 },
        cointerventionReported: { type: "boolean" },
        excludedByProtocol: { type: "boolean" },
      },
      required: ["studyId", "cointerventionReported", "excludedByProtocol"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { requiresProtocolReview: { type: "boolean" } },
      required: ["requiresProtocolReview"],
    },
    ports: {
      inputs: [
        {
          id: "studyId",
          label: "Study Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "cointerventionReported",
          label: "Cointervention Reported",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "excludedByProtocol",
          label: "Excluded By Protocol",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "requiresProtocolReview",
          label: "Requires Protocol Review",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = osteopathicStudyCointerventionFlagTool.execute;
export default osteopathicStudyCointerventionFlagTool;
