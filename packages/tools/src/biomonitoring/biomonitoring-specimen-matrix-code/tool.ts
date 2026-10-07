import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleId: string;
  readonly matrixCode: string;
  readonly codeSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleId: { type: "string", maxLength: 8192, minLength: 1 },
    matrixCode: { type: "string", maxLength: 8192, minLength: 1 },
    codeSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["sampleId", "matrixCode", "codeSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit specimen-matrix code by source without identifying the specimen or selecting a method. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleId, matrixCode, codeSource } = request;
  const compute = (): Output => {
    H.domain(sampleId.length > 0, "sampleId");
    H.domain(matrixCode.length > 0, "matrixCode");
    H.domain(codeSource.length > 0, "codeSource");
    return { token: JSON.stringify([sampleId, matrixCode, codeSource]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sampleId: "S17", matrixCode: "MAT2", codeSource: "Lab dictionary" },
  output: { token: '["S17","MAT2","Lab dictionary"]' },
} satisfies ToolExample<Input, Output>;
export const biomonitoringSpecimenMatrixCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biomonitoring", "biology"],
      keywords: ["biomonitoring", "biology"],
    },
    id: "biomonitoring/biomonitoring-specimen-matrix-code",
    title: "Biomonitoring Specimen Matrix Code",
    description:
      "Qualify an explicit specimen-matrix code by source without identifying the specimen or selecting a method.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleId: { type: "string", maxLength: 8192, minLength: 1 },
        matrixCode: { type: "string", maxLength: 8192, minLength: 1 },
        codeSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["sampleId", "matrixCode", "codeSource"],
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
          id: "matrixCode",
          label: "Matrix Code",
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
export const run = biomonitoringSpecimenMatrixCodeTool.execute;
export default biomonitoringSpecimenMatrixCodeTool;
