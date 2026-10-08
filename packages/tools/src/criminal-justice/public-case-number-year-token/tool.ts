import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly courtCode: string;
  readonly caseNumberText: string;
  readonly yearText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    courtCode: { type: "string", maxLength: 8192, minLength: 1 },
    caseNumberText: { type: "string", maxLength: 8192, minLength: 1 },
    yearText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["courtCode", "caseNumberText", "yearText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Encode an exact public case-number and year transcription with a supplied court namespace. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { courtCode, caseNumberText, yearText } = request;
  const compute = (): Output => {
    H.domain(courtCode.length > 0, "courtCode");
    H.domain(caseNumberText.length > 0, "caseNumberText");
    H.domain(yearText.length > 0, "yearText");
    return { token: JSON.stringify([courtCode, caseNumberText, yearText]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { courtCode: "C17", caseNumberText: "00124", yearText: "2026" },
  output: { token: '["C17","00124","2026"]' },
} satisfies ToolExample<Input, Output>;
export const publicCaseNumberYearTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["criminal-justice", "criminal justice", "social sciences"],
      keywords: ["criminal justice", "social sciences"],
    },
    id: "criminal-justice/public-case-number-year-token",
    title: "Public Case Number Year Token",
    description:
      "Encode an exact public case-number and year transcription with a supplied court namespace.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        courtCode: { type: "string", maxLength: 8192, minLength: 1 },
        caseNumberText: { type: "string", maxLength: 8192, minLength: 1 },
        yearText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["courtCode", "caseNumberText", "yearText"],
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
          id: "courtCode",
          label: "Court Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "caseNumberText",
          label: "Case Number Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "yearText",
          label: "Year Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = publicCaseNumberYearTokenTool.execute;
export default publicCaseNumberYearTokenTool;
