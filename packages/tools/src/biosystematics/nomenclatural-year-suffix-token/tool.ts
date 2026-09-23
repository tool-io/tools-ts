import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly token: string };
export type Output = { readonly year: number; readonly suffix: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    year: { type: "integer" },
    suffix: { type: "string", maxLength: 8192 },
  },
  required: ["year", "suffix"],
} as const;
/** Split a four-digit bibliographic year and lowercase editorial suffix; not a nomenclatural code validator. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token } = request;
  const compute = (): Output => {
    const match = /^(\d{4})([a-z]*)(?![\s\S])/.exec(token);
    H.domain(match, "token");
    return { year: Number(match[1]), suffix: match[2] };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "1900ab" },
  output: { year: 1900, suffix: "ab" },
} satisfies ToolExample<Input, Output>;
export const nomenclaturalYearSuffixTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biosystematics/nomenclatural-year-suffix-token",
    title: "Nomenclatural Year Suffix Token Tool",
    description:
      "Split a four-digit bibliographic year and lowercase editorial suffix; not a nomenclatural code validator.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        year: { type: "integer" },
        suffix: { type: "string", maxLength: 8192 },
      },
      required: ["year", "suffix"],
    },
    ports: {
      inputs: [
        {
          id: "token",
          label: "Token",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "year", label: "Year", valueType: { type: "integer" } },
        { id: "suffix", label: "Suffix", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = nomenclaturalYearSuffixTokenTool.execute;
export default nomenclaturalYearSuffixTokenTool;
