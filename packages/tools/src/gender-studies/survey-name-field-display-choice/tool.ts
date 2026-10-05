import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly preferredDisplayName: string;
  readonly participantCode: string;
  readonly displayConsent: boolean;
};
export type Output = { readonly displayLabel: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    preferredDisplayName: { type: "string", maxLength: 8192 },
    participantCode: { type: "string", maxLength: 8192 },
    displayConsent: { type: "boolean" },
  },
  required: ["preferredDisplayName", "participantCode", "displayConsent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { displayLabel: { type: "string", maxLength: 8192 } },
  required: ["displayLabel"],
} as const;
/** Select a supplied preferred display name only when the explicit display-consent flag permits it; otherwise use the participant code. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { preferredDisplayName, participantCode, displayConsent } = request;
  const compute = (): Output => {
    H.domain(participantCode.length > 0, "participantCode");
    H.domain(
      !displayConsent || preferredDisplayName.trim().length > 0,
      "displayConsent",
    );
    return {
      displayLabel: displayConsent ? preferredDisplayName : participantCode,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    preferredDisplayName: "Alex",
    participantCode: "P-17",
    displayConsent: true,
  },
  output: { displayLabel: "Alex" },
} satisfies ToolExample<Input, Output>;
export const surveyNameFieldDisplayChoiceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gender-studies/survey-name-field-display-choice",
    title: "Survey Name Field Display Choice Tool",
    description:
      "Select a supplied preferred display name only when the explicit display-consent flag permits it; otherwise use the participant code.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        preferredDisplayName: { type: "string", maxLength: 8192 },
        participantCode: { type: "string", maxLength: 8192 },
        displayConsent: { type: "boolean" },
      },
      required: ["preferredDisplayName", "participantCode", "displayConsent"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { displayLabel: { type: "string", maxLength: 8192 } },
      required: ["displayLabel"],
    },
    ports: {
      inputs: [
        {
          id: "preferredDisplayName",
          label: "Preferred Display Name",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "participantCode",
          label: "Participant Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "displayConsent",
          label: "Display Consent",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "displayLabel",
          label: "Display Label",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = surveyNameFieldDisplayChoiceTool.execute;
export default surveyNameFieldDisplayChoiceTool;
