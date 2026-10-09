import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleId: string;
  readonly dispositionCode: string;
  readonly codeSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleId: { type: "string", maxLength: 8192, minLength: 1 },
    dispositionCode: { type: "string", maxLength: 8192, minLength: 1 },
    codeSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["sampleId", "dispositionCode", "codeSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit sample disposition code by source without deciding disposal or retention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleId, dispositionCode, codeSource } = request;
  const compute = (): Output => {
    H.domain(sampleId.length > 0, "sampleId");
    H.domain(dispositionCode.length > 0, "dispositionCode");
    H.domain(codeSource.length > 0, "codeSource");
    return { token: JSON.stringify([sampleId, dispositionCode, codeSource]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sampleId: "S17",
    dispositionCode: "retained",
    codeSource: "Local key A",
  },
  output: { token: '["S17","retained","Local key A"]' },
} satisfies ToolExample<Input, Output>;
export const glpSampleDispositionCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "glp",
        "good laboratory practice",
        "research and quality management",
      ],
      keywords: [
        "good laboratory practice",
        "research and quality management",
        "GLP",
      ],
    },
    id: "glp/glp-sample-disposition-code",
    title: "GLP Sample Disposition Code",
    description:
      "Qualify an explicit sample disposition code by source without deciding disposal or retention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleId: { type: "string", maxLength: 8192, minLength: 1 },
        dispositionCode: { type: "string", maxLength: 8192, minLength: 1 },
        codeSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["sampleId", "dispositionCode", "codeSource"],
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
          id: "sampleId",
          label: "Sample Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "dispositionCode",
          label: "Disposition Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "codeSource",
          label: "Code Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = glpSampleDispositionCodeTool.execute;
export default glpSampleDispositionCodeTool;
