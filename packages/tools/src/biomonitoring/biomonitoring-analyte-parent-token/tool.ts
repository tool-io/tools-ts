import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly resultId: string;
  readonly analyteCode: string;
  readonly parentAnalyteCode: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    resultId: { type: "string", maxLength: 8192, minLength: 1 },
    analyteCode: { type: "string", maxLength: 8192, minLength: 1 },
    parentAnalyteCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["resultId", "analyteCode", "parentAnalyteCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an explicitly supplied analyte-parent relationship without inferring metabolism or chemical identity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { resultId, analyteCode, parentAnalyteCode } = request;
  const compute = (): Output => {
    H.domain(resultId.length > 0, "resultId");
    H.domain(analyteCode.length > 0, "analyteCode");
    H.domain(parentAnalyteCode.length > 0, "parentAnalyteCode");
    return {
      token: JSON.stringify([resultId, analyteCode, parentAnalyteCode]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { resultId: "R17", analyteCode: "MET2", parentAnalyteCode: "PARENT2" },
  output: { token: '["R17","MET2","PARENT2"]' },
} satisfies ToolExample<Input, Output>;
export const biomonitoringAnalyteParentTokenTool = H.defineSchemaCalculation<
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
    id: "biomonitoring/biomonitoring-analyte-parent-token",
    title: "Biomonitoring Analyte Parent Token",
    description:
      "Record an explicitly supplied analyte-parent relationship without inferring metabolism or chemical identity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        resultId: { type: "string", maxLength: 8192, minLength: 1 },
        analyteCode: { type: "string", maxLength: 8192, minLength: 1 },
        parentAnalyteCode: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["resultId", "analyteCode", "parentAnalyteCode"],
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
          id: "resultId",
          label: "Result Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "analyteCode",
          label: "Analyte Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "parentAnalyteCode",
          label: "Parent Analyte Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = biomonitoringAnalyteParentTokenTool.execute;
export default biomonitoringAnalyteParentTokenTool;
