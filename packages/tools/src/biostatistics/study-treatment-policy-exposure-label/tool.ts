import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly participantId: string;
  readonly exposureCode: string;
  readonly estimandSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    participantId: { type: "string", maxLength: 8192, minLength: 1 },
    exposureCode: { type: "string", maxLength: 8192, minLength: 1 },
    estimandSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["participantId", "exposureCode", "estimandSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record explicit treatment-policy exposure metadata and estimand source without imputing treatment effects. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { participantId, exposureCode, estimandSource } = request;
  const compute = (): Output => {
    H.domain(participantId.length > 0, "participantId");
    H.domain(exposureCode.length > 0, "exposureCode");
    H.domain(estimandSource.length > 0, "estimandSource");
    return {
      token: JSON.stringify([participantId, exposureCode, estimandSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    participantId: "P17",
    exposureCode: "assigned treatment",
    estimandSource: "protocol P4",
  },
  output: { token: '["P17","assigned treatment","protocol P4"]' },
} satisfies ToolExample<Input, Output>;
export const studyTreatmentPolicyExposureLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["biostatistics", "research and quality management"],
      keywords: ["biostatistics", "research and quality management"],
    },
    id: "biostatistics/study-treatment-policy-exposure-label",
    title: "Study Treatment Policy Exposure Label",
    description:
      "Record explicit treatment-policy exposure metadata and estimand source without imputing treatment effects.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        participantId: { type: "string", maxLength: 8192, minLength: 1 },
        exposureCode: { type: "string", maxLength: 8192, minLength: 1 },
        estimandSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["participantId", "exposureCode", "estimandSource"],
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
          id: "exposureCode",
          label: "Exposure Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "estimandSource",
          label: "Estimand Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = studyTreatmentPolicyExposureLabelTool.execute;
export default studyTreatmentPolicyExposureLabelTool;
