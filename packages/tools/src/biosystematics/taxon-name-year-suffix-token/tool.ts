import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly token: string; readonly separator: string };
export type Output = {
  readonly nameToken: string;
  readonly year: number;
  readonly suffix: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    token: { type: "string", maxLength: 8192 },
    separator: { type: "string", maxLength: 8192 },
  },
  required: ["token", "separator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nameToken: { type: "string", maxLength: 8192 },
    year: { type: "integer" },
    suffix: { type: "string", maxLength: 8192 },
  },
  required: ["nameToken", "year", "suffix"],
} as const;
/** Split a public name/year citation token under an explicit separator; no nomenclatural validity judgment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token, separator } = request;
  const compute = (): Output => {
    H.domain(separator.length > 0);
    const i = token.lastIndexOf(separator);
    H.domain(i > 0);
    const match = /^(\d{4})([a-z]?)(?![\s\S])/.exec(
      token.slice(i + separator.length),
    );
    H.domain(match !== null);
    return {
      nameToken: token.slice(0, i),
      year: Number(match[1]),
      suffix: match[2],
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "Name|1901a", separator: "|" },
  output: { nameToken: "Name", year: 1901, suffix: "a" },
} satisfies ToolExample<Input, Output>;
export const taxonNameYearSuffixTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biosystematics/taxon-name-year-suffix-token",
    title: "Taxon Name Year Suffix Token Tool",
    description:
      "Split a public name/year citation token under an explicit separator; no nomenclatural validity judgment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        token: { type: "string", maxLength: 8192 },
        separator: { type: "string", maxLength: 8192 },
      },
      required: ["token", "separator"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nameToken: { type: "string", maxLength: 8192 },
        year: { type: "integer" },
        suffix: { type: "string", maxLength: 8192 },
      },
      required: ["nameToken", "year", "suffix"],
    },
    ports: {
      inputs: [
        {
          id: "token",
          label: "Token",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "separator",
          label: "Separator",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "nameToken", label: "Name Token", valueType: { type: "string" } },
        { id: "year", label: "Year", valueType: { type: "integer" } },
        { id: "suffix", label: "Suffix", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = taxonNameYearSuffixTokenTool.execute;
export default taxonNameYearSuffixTokenTool;
