import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly resultId: string;
  readonly recordedCode: string;
  readonly source: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    resultId: { type: "string", maxLength: 8192, minLength: 1 },
    recordedCode: { type: "string", maxLength: 8192, minLength: 1 },
    source: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["resultId", "recordedCode", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record a supplied gynecologic screening code and source without interpreting risk or recommending follow-up. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { resultId, recordedCode, source } = request;
  const compute = (): Output => {
    H.domain(resultId.length > 0, "resultId");
    H.domain(recordedCode.length > 0, "recordedCode");
    H.domain(source.length > 0, "source");
    return { token: JSON.stringify([resultId, recordedCode, source]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { resultId: "R17", recordedCode: "CODE-A", source: "Lab A" },
  output: { token: '["R17","CODE-A","Lab A"]' },
} satisfies ToolExample<Input, Output>;
export const gynecologyScreeningResultSourceCodeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: ["gynecology", "health and medicine"],
        keywords: ["gynecology", "health and medicine"],
      },
      id: "gynecology/gynecology-screening-result-source-code",
      title: "Gynecology Screening Result Source Code",
      description:
        "Record a supplied gynecologic screening code and source without interpreting risk or recommending follow-up.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          resultId: { type: "string", maxLength: 8192, minLength: 1 },
          recordedCode: { type: "string", maxLength: 8192, minLength: 1 },
          source: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["resultId", "recordedCode", "source"],
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
            id: "recordedCode",
            label: "Recorded Code",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "source",
            label: "Source",
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
export const run = gynecologyScreeningResultSourceCodeTool.execute;
export default gynecologyScreeningResultSourceCodeTool;
