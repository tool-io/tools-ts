import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly participantId: string;
  readonly returnPreference: string;
  readonly preferenceSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    participantId: { type: "string", maxLength: 8192, minLength: 1 },
    returnPreference: { type: "string", maxLength: 8192, minLength: 1 },
    preferenceSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["participantId", "returnPreference", "preferenceSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit result-return preference wording without communicating results or assessing consent. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { participantId, returnPreference, preferenceSource } = request;
  const compute = (): Output => {
    H.domain(participantId.length > 0, "participantId");
    H.domain(returnPreference.length > 0, "returnPreference");
    H.domain(preferenceSource.length > 0, "preferenceSource");
    return {
      token: JSON.stringify([
        participantId,
        returnPreference,
        preferenceSource,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    participantId: "P17",
    returnPreference: "return requested",
    preferenceSource: "Participant form",
  },
  output: { token: '["P17","return requested","Participant form"]' },
} satisfies ToolExample<Input, Output>;
export const biomonitoringResultReturnPreferenceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["biomonitoring", "biology"],
        keywords: ["biomonitoring", "biology"],
      },
      id: "biomonitoring/biomonitoring-result-return-preference",
      title: "Biomonitoring Result Return Preference",
      description:
        "Preserve explicit result-return preference wording without communicating results or assessing consent.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          participantId: { type: "string", maxLength: 8192, minLength: 1 },
          returnPreference: { type: "string", maxLength: 8192, minLength: 1 },
          preferenceSource: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["participantId", "returnPreference", "preferenceSource"],
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
            id: "participantId",
            label: "Participant Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "returnPreference",
            label: "Return Preference",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "preferenceSource",
            label: "Preference Source",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = biomonitoringResultReturnPreferenceTool.execute;
export default biomonitoringResultReturnPreferenceTool;
