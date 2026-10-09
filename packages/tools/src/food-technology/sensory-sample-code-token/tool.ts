import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly studyId: string;
  readonly blindSampleCode: string;
  readonly codebookVersion: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    studyId: { type: "string", maxLength: 8192, minLength: 1 },
    blindSampleCode: { type: "string", maxLength: 8192, minLength: 1 },
    codebookVersion: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["studyId", "blindSampleCode", "codebookVersion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit sensory blind-sample code by study and codebook version while preserving leading zeros. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { studyId, blindSampleCode, codebookVersion } = request;
  const compute = (): Output => {
    H.domain(studyId.length > 0, "studyId");
    H.domain(blindSampleCode.length > 0, "blindSampleCode");
    H.domain(codebookVersion.length > 0, "codebookVersion");
    return {
      token: JSON.stringify([studyId, blindSampleCode, codebookVersion]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { studyId: "ST17", blindSampleCode: "031", codebookVersion: "v2" },
  output: { token: '["ST17","031","v2"]' },
} satisfies ToolExample<Input, Output>;
export const sensorySampleCodeTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "food-technology",
        "food technology",
        "research and quality management",
      ],
      keywords: ["food technology", "research and quality management"],
    },
    id: "food-technology/sensory-sample-code-token",
    title: "Sensory Sample Code Token",
    description:
      "Qualify an explicit sensory blind-sample code by study and codebook version while preserving leading zeros.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        studyId: { type: "string", maxLength: 8192, minLength: 1 },
        blindSampleCode: { type: "string", maxLength: 8192, minLength: 1 },
        codebookVersion: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["studyId", "blindSampleCode", "codebookVersion"],
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
          id: "blindSampleCode",
          label: "Blind Sample Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "codebookVersion",
          label: "Codebook Version",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = sensorySampleCodeTokenTool.execute;
export default sensorySampleCodeTokenTool;
