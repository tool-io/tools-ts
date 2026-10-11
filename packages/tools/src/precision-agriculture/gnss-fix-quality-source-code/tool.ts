import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fixRecordId: string;
  readonly qualityCode: string;
  readonly codeSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fixRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    qualityCode: { type: "string", maxLength: 8192, minLength: 1 },
    codeSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["fixRecordId", "qualityCode", "codeSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit GNSS quality code by source without estimating positioning accuracy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fixRecordId, qualityCode, codeSource } = request;
  const compute = (): Output => {
    H.domain(fixRecordId.length > 0, "fixRecordId");
    H.domain(qualityCode.length > 0, "qualityCode");
    H.domain(codeSource.length > 0, "codeSource");
    return { token: JSON.stringify([fixRecordId, qualityCode, codeSource]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    fixRecordId: "FIX17",
    qualityCode: "Q2",
    codeSource: "Receiver key A",
  },
  output: { token: '["FIX17","Q2","Receiver key A"]' },
} satisfies ToolExample<Input, Output>;
export const gnssFixQualitySourceCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["precision-agriculture", "precision agriculture", "agriculture"],
      keywords: ["precision agriculture", "agriculture"],
    },
    id: "precision-agriculture/gnss-fix-quality-source-code",
    title: "Gnss Fix Quality Source Code",
    description:
      "Qualify an explicit GNSS quality code by source without estimating positioning accuracy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fixRecordId: { type: "string", maxLength: 8192, minLength: 1 },
        qualityCode: { type: "string", maxLength: 8192, minLength: 1 },
        codeSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["fixRecordId", "qualityCode", "codeSource"],
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
          id: "fixRecordId",
          label: "Fix Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "qualityCode",
          label: "Quality Code",
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
export const run = gnssFixQualitySourceCodeTool.execute;
export default gnssFixQualitySourceCodeTool;
