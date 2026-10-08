import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly householdCode: string;
  readonly residencePatternCode: string;
  readonly codebook: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    householdCode: { type: "string", maxLength: 8192, minLength: 1 },
    residencePatternCode: { type: "string", maxLength: 8192, minLength: 1 },
    codebook: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["householdCode", "residencePatternCode", "codebook"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve a caller-coded residence-pattern record with its source codebook without inferring household relationships. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { householdCode, residencePatternCode, codebook } = request;
  const compute = (): Output => {
    H.domain(
      householdCode.length > 0 &&
        residencePatternCode.length > 0 &&
        codebook.length > 0,
      "householdCode",
    );
    return {
      token: JSON.stringify([householdCode, residencePatternCode, codebook]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    householdCode: "H17",
    residencePatternCode: "RP3",
    codebook: "codebook-v2",
  },
  output: { token: '["H17","RP3","codebook-v2"]' },
} satisfies ToolExample<Input, Output>;
export const householdResidencePatternSourceCodeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: [
          "cultural-anthropology",
          "cultural anthropology",
          "social sciences",
        ],
        keywords: ["cultural anthropology", "social sciences"],
      },
      id: "cultural-anthropology/household-residence-pattern-source-code",
      title: "Household Residence Pattern Source Code",
      description:
        "Preserve a caller-coded residence-pattern record with its source codebook without inferring household relationships.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          householdCode: { type: "string", maxLength: 8192, minLength: 1 },
          residencePatternCode: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
          codebook: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["householdCode", "residencePatternCode", "codebook"],
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
            id: "householdCode",
            label: "Household Code",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "residencePatternCode",
            label: "Residence Pattern Code",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "codebook",
            label: "Codebook",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = householdResidencePatternSourceCodeTool.execute;
export default householdResidencePatternSourceCodeTool;
