import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly actionId: string;
  readonly evidenceRecordId: string;
  readonly version: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    actionId: { type: "string", maxLength: 8192, minLength: 1 },
    evidenceRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    version: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["actionId", "evidenceRecordId", "version"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit quality-evidence reference by version without assessing sufficiency. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { actionId, evidenceRecordId, version } = request;
  const compute = (): Output => {
    H.domain(actionId.length > 0, "actionId");
    H.domain(evidenceRecordId.length > 0, "evidenceRecordId");
    H.domain(version.length > 0, "version");
    return { token: JSON.stringify([actionId, evidenceRecordId, version]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { actionId: "ACT17", evidenceRecordId: "EV2", version: "v2" },
  output: { token: '["ACT17","EV2","v2"]' },
} satisfies ToolExample<Input, Output>;
export const qualityEvidenceRecordVersionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "quality-assurance",
        "quality assurance",
        "research and quality management",
      ],
      keywords: ["quality assurance", "research and quality management"],
    },
    id: "quality-assurance/quality-evidence-record-version",
    title: "Quality Evidence Record Version",
    description:
      "Qualify an explicit quality-evidence reference by version without assessing sufficiency.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        actionId: { type: "string", maxLength: 8192, minLength: 1 },
        evidenceRecordId: { type: "string", maxLength: 8192, minLength: 1 },
        version: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["actionId", "evidenceRecordId", "version"],
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
          id: "actionId",
          label: "Action Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "evidenceRecordId",
          label: "Evidence Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "version",
          label: "Version",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = qualityEvidenceRecordVersionTool.execute;
export default qualityEvidenceRecordVersionTool;
