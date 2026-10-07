import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly studyId: string;
  readonly endpointId: string;
  readonly sourceVersion: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    studyId: { type: "string", maxLength: 8192, minLength: 1 },
    endpointId: { type: "string", maxLength: 8192, minLength: 1 },
    sourceVersion: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["studyId", "endpointId", "sourceVersion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit clinical endpoint identifier by source version without deriving endpoint values. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { studyId, endpointId, sourceVersion } = request;
  const compute = (): Output => {
    H.domain(studyId.length > 0, "studyId");
    H.domain(endpointId.length > 0, "endpointId");
    H.domain(sourceVersion.length > 0, "sourceVersion");
    return { token: JSON.stringify([studyId, endpointId, sourceVersion]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { studyId: "ST17", endpointId: "EP2", sourceVersion: "v2" },
  output: { token: '["ST17","EP2","v2"]' },
} satisfies ToolExample<Input, Output>;
export const clinicalEndpointSourceKeyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "clinical-research",
        "clinical research",
        "research and quality management",
      ],
      keywords: ["clinical research", "research and quality management"],
    },
    id: "clinical-research/clinical-endpoint-source-key",
    title: "Clinical Endpoint Source Key",
    description:
      "Qualify an explicit clinical endpoint identifier by source version without deriving endpoint values.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        studyId: { type: "string", maxLength: 8192, minLength: 1 },
        endpointId: { type: "string", maxLength: 8192, minLength: 1 },
        sourceVersion: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["studyId", "endpointId", "sourceVersion"],
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
          id: "studyId",
          label: "Study Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "endpointId",
          label: "Endpoint Id",
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
export const run = clinicalEndpointSourceKeyTool.execute;
export default clinicalEndpointSourceKeyTool;
