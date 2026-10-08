import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly priorFormSeen: boolean;
  readonly sharedItemsKnown: boolean;
};
export type Output = { readonly priorExposureFlag: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    priorFormSeen: { type: "boolean" },
    sharedItemsKnown: { type: "boolean" },
  },
  required: ["priorFormSeen", "sharedItemsKnown"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { priorExposureFlag: { type: "boolean" } },
  required: ["priorExposureFlag"],
} as const;
/** Flag explicitly recorded prior-form or shared-item exposure for an assessment retake without estimating practice effects. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { priorFormSeen, sharedItemsKnown } = request;
  const compute = (): Output => {
    return { priorExposureFlag: priorFormSeen || sharedItemsKnown };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { priorFormSeen: false, sharedItemsKnown: true },
  output: { priorExposureFlag: true },
} satisfies ToolExample<Input, Output>;
export const assessmentRetakeExposureFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "educational-psychology/assessment-retake-exposure-flag",
    title: "Assessment Retake Exposure Flag Tool",
    description:
      "Flag explicitly recorded prior-form or shared-item exposure for an assessment retake without estimating practice effects.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        priorFormSeen: { type: "boolean" },
        sharedItemsKnown: { type: "boolean" },
      },
      required: ["priorFormSeen", "sharedItemsKnown"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { priorExposureFlag: { type: "boolean" } },
      required: ["priorExposureFlag"],
    },
    ports: {
      inputs: [
        {
          id: "priorFormSeen",
          label: "Prior Form Seen",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "sharedItemsKnown",
          label: "Shared Items Known",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "priorExposureFlag",
          label: "Prior Exposure Flag",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = assessmentRetakeExposureFlagTool.execute;
export default assessmentRetakeExposureFlagTool;
