import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly biologicalSampleId: string;
  readonly assayRunId: string;
  readonly technicalReplicateCode: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    biologicalSampleId: { type: "string", maxLength: 8192, minLength: 1 },
    assayRunId: { type: "string", maxLength: 8192, minLength: 1 },
    technicalReplicateCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["biologicalSampleId", "assayRunId", "technicalReplicateCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Distinguish an explicitly labeled technical replicate from its biological sample and assay run. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { biologicalSampleId, assayRunId, technicalReplicateCode } = request;
  const compute = (): Output => {
    H.domain(biologicalSampleId.length > 0, "biologicalSampleId");
    H.domain(assayRunId.length > 0, "assayRunId");
    H.domain(technicalReplicateCode.length > 0, "technicalReplicateCode");
    return {
      token: JSON.stringify([
        biologicalSampleId,
        assayRunId,
        technicalReplicateCode,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    biologicalSampleId: "S17",
    assayRunId: "RUN-A",
    technicalReplicateCode: "R2",
  },
  output: { token: '["S17","RUN-A","R2"]' },
} satisfies ToolExample<Input, Output>;
export const immuneAssayTechnicalReplicateTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["immunology", "health and medicine"],
      keywords: ["immunology", "health and medicine"],
    },
    id: "immunology/immune-assay-technical-replicate-tag",
    title: "Immune Assay Technical Replicate Tag",
    description:
      "Distinguish an explicitly labeled technical replicate from its biological sample and assay run.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        biologicalSampleId: { type: "string", maxLength: 8192, minLength: 1 },
        assayRunId: { type: "string", maxLength: 8192, minLength: 1 },
        technicalReplicateCode: {
          type: "string",
          maxLength: 8192,
          minLength: 1,
        },
      },
      required: ["biologicalSampleId", "assayRunId", "technicalReplicateCode"],
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
          id: "biologicalSampleId",
          label: "Biological Sample Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "assayRunId",
          label: "Assay Run Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "technicalReplicateCode",
          label: "Technical Replicate Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = immuneAssayTechnicalReplicateTagTool.execute;
export default immuneAssayTechnicalReplicateTagTool;
