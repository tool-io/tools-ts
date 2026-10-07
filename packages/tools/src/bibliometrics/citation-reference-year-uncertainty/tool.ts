import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceId: string;
  readonly yearText: string;
  readonly uncertaintyCode: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceId: { type: "string", maxLength: 8192, minLength: 1 },
    yearText: { type: "string", maxLength: 8192, minLength: 1 },
    uncertaintyCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["referenceId", "yearText", "uncertaintyCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit citation year transcription and supplied uncertainty code without normalizing uncertain dates. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceId, yearText, uncertaintyCode } = request;
  const compute = (): Output => {
    H.domain(referenceId.length > 0, "referenceId");
    H.domain(yearText.length > 0, "yearText");
    H.domain(uncertaintyCode.length > 0, "uncertaintyCode");
    return { token: JSON.stringify([referenceId, yearText, uncertaintyCode]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    referenceId: "R17",
    yearText: "circa 1900",
    uncertaintyCode: "approximate",
  },
  output: { token: '["R17","circa 1900","approximate"]' },
} satisfies ToolExample<Input, Output>;
export const citationReferenceYearUncertaintyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["bibliometrics", "research and quality management"],
      keywords: ["bibliometrics", "research and quality management"],
    },
    id: "bibliometrics/citation-reference-year-uncertainty",
    title: "Citation Reference Year Uncertainty",
    description:
      "Preserve an explicit citation year transcription and supplied uncertainty code without normalizing uncertain dates.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceId: { type: "string", maxLength: 8192, minLength: 1 },
        yearText: { type: "string", maxLength: 8192, minLength: 1 },
        uncertaintyCode: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["referenceId", "yearText", "uncertaintyCode"],
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
          id: "referenceId",
          label: "Reference Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "yearText",
          label: "Year Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "uncertaintyCode",
          label: "Uncertainty Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = citationReferenceYearUncertaintyTool.execute;
export default citationReferenceYearUncertaintyTool;
