import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly response: string;
  readonly missingCodes: readonly string[];
};
export type Output = { readonly missing: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    response: { type: "string", maxLength: 8192 },
    missingCodes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["response", "missingCodes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { missing: { type: "boolean" } },
  required: ["missing"],
} as const;
/** Identify a literal missing-response code from an explicit survey code list; no self-description is recoded. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { response, missingCodes } = request;
  const compute = (): Output => {
    return { missing: missingCodes.includes(response) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { response: "NA", missingCodes: ["NA", "not answered"] },
  output: { missing: true },
} satisfies ToolExample<Input, Output>;
export const genderSurveyMissingCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gender-studies/gender-survey-missing-code",
    title: "Gender Survey Missing Code Tool",
    description:
      "Identify a literal missing-response code from an explicit survey code list; no self-description is recoded.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        response: { type: "string", maxLength: 8192 },
        missingCodes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["response", "missingCodes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { missing: { type: "boolean" } },
      required: ["missing"],
    },
    ports: {
      inputs: [
        {
          id: "response",
          label: "Response",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "missingCodes",
          label: "Missing Codes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        { id: "missing", label: "Missing", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = genderSurveyMissingCodeTool.execute;
export default genderSurveyMissingCodeTool;
