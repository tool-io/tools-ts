import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly claimId: string;
  readonly sourceId: string;
  readonly sourceVersion: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    claimId: { type: "string", maxLength: 8192, minLength: 1 },
    sourceId: { type: "string", maxLength: 8192, minLength: 1 },
    sourceVersion: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["claimId", "sourceId", "sourceVersion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Associate a procurement claim with its explicit source and version without verifying the claim. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { claimId, sourceId, sourceVersion } = request;
  const compute = (): Output => {
    H.domain(claimId.length > 0, "claimId");
    H.domain(sourceId.length > 0, "sourceId");
    H.domain(sourceVersion.length > 0, "sourceVersion");
    return { token: JSON.stringify([claimId, sourceId, sourceVersion]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { claimId: "C17", sourceId: "S4", sourceVersion: "v2" },
  output: { token: '["C17","S4","v2"]' },
} satisfies ToolExample<Input, Output>;
export const procurementClaimSourceVersionLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["applied-ethics", "applied ethics", "philosophy"],
      keywords: ["applied ethics", "philosophy"],
    },
    id: "applied-ethics/procurement-claim-source-version-label",
    title: "Procurement Claim Source Version Label",
    description:
      "Associate a procurement claim with its explicit source and version without verifying the claim.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        claimId: { type: "string", maxLength: 8192, minLength: 1 },
        sourceId: { type: "string", maxLength: 8192, minLength: 1 },
        sourceVersion: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["claimId", "sourceId", "sourceVersion"],
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
          id: "claimId",
          label: "Claim Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceId",
          label: "Source Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceVersion",
          label: "Source Version",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = procurementClaimSourceVersionLabelTool.execute;
export default procurementClaimSourceVersionLabelTool;
