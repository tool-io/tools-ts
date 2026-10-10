import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly infantRecordId: string;
  readonly ageWording: string;
  readonly datingSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    infantRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    ageWording: { type: "string", maxLength: 8192, minLength: 1 },
    datingSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["infantRecordId", "ageWording", "datingSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record supplied corrected-age wording and source without estimating corrected age or a dating reference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { infantRecordId, ageWording, datingSource } = request;
  const compute = (): Output => {
    H.domain(infantRecordId.length > 0, "infantRecordId");
    H.domain(ageWording.length > 0, "ageWording");
    H.domain(datingSource.length > 0, "datingSource");
    return {
      token: JSON.stringify([infantRecordId, ageWording, datingSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    infantRecordId: "I17",
    ageWording: "corrected age recorded as 2 weeks",
    datingSource: "Clinician record",
  },
  output: {
    token: '["I17","corrected age recorded as 2 weeks","Clinician record"]',
  },
} satisfies ToolExample<Input, Output>;
export const newBornCorrectedAgeSourceLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["neonatology", "health and medicine"],
      keywords: ["neonatology", "health and medicine"],
    },
    id: "neonatology/new-born-corrected-age-source-label",
    title: "Newborn Corrected Age Source Label",
    description:
      "Record supplied corrected-age wording and source without estimating corrected age or a dating reference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        infantRecordId: { type: "string", maxLength: 8192, minLength: 1 },
        ageWording: { type: "string", maxLength: 8192, minLength: 1 },
        datingSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["infantRecordId", "ageWording", "datingSource"],
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
          id: "infantRecordId",
          label: "Infant Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "ageWording",
          label: "Age Wording",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "datingSource",
          label: "Dating Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = newBornCorrectedAgeSourceLabelTool.execute;
export default newBornCorrectedAgeSourceLabelTool;
