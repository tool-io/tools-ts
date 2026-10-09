import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly specimenId: string;
  readonly rejectionCode: string;
  readonly policySource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    specimenId: { type: "string", maxLength: 8192, minLength: 1 },
    rejectionCode: { type: "string", maxLength: 8192, minLength: 1 },
    policySource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["specimenId", "rejectionCode", "policySource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an explicitly assigned specimen-rejection code and policy reference without deciding specimen acceptability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { specimenId, rejectionCode, policySource } = request;
  const compute = (): Output => {
    H.domain(specimenId.length > 0, "specimenId");
    H.domain(rejectionCode.length > 0, "rejectionCode");
    H.domain(policySource.length > 0, "policySource");
    return { token: JSON.stringify([specimenId, rejectionCode, policySource]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    specimenId: "S17",
    rejectionCode: "R1",
    policySource: "Policy A v2",
  },
  output: { token: '["S17","R1","Policy A v2"]' },
} satisfies ToolExample<Input, Output>;
export const hematologySpecimenRejectionCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["hematology", "health and medicine"],
      keywords: ["hematology", "health and medicine"],
    },
    id: "hematology/hematology-specimen-rejection-code",
    title: "Hematology Specimen Rejection Code",
    description:
      "Record an explicitly assigned specimen-rejection code and policy reference without deciding specimen acceptability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        specimenId: { type: "string", maxLength: 8192, minLength: 1 },
        rejectionCode: { type: "string", maxLength: 8192, minLength: 1 },
        policySource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["specimenId", "rejectionCode", "policySource"],
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
          id: "specimenId",
          label: "Specimen Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "rejectionCode",
          label: "Rejection Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "policySource",
          label: "Policy Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = hematologySpecimenRejectionCodeTool.execute;
export default hematologySpecimenRejectionCodeTool;
