import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly token: string;
  readonly eraPrefix: string;
  readonly separator: string;
};
export type Output = { readonly era: string; readonly year: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    token: { type: "string", maxLength: 8192 },
    eraPrefix: { type: "string", maxLength: 8192 },
    separator: { type: "string", maxLength: 8192 },
  },
  required: ["token", "eraPrefix", "separator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    era: { type: "string", maxLength: 8192 },
    year: { type: "integer" },
  },
  required: ["era", "year"],
} as const;
/** Read a caller-defined era label and positive decimal year without calendar conversion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token, eraPrefix, separator } = request;
  const compute = (): Output => {
    H.domain(
      eraPrefix.length > 0 &&
        separator.length > 0 &&
        token.startsWith(eraPrefix + separator),
    );
    const suffix = token.slice(eraPrefix.length + separator.length);
    H.domain(/^[1-9]\d*(?![\s\S])/.test(suffix));
    const year = Number(suffix);
    H.integer(year, 1);
    return { era: eraPrefix, year };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "EraA-12", eraPrefix: "EraA", separator: "-" },
  output: { era: "EraA", year: 12 },
} satisfies ToolExample<Input, Output>;
export const publicEraYearTokenTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "asian-studies/public-era-year-token",
    title: "Public Era Year Token Tool",
    description:
      "Read a caller-defined era label and positive decimal year without calendar conversion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        token: { type: "string", maxLength: 8192 },
        eraPrefix: { type: "string", maxLength: 8192 },
        separator: { type: "string", maxLength: 8192 },
      },
      required: ["token", "eraPrefix", "separator"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        era: { type: "string", maxLength: 8192 },
        year: { type: "integer" },
      },
      required: ["era", "year"],
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
          id: "eraPrefix",
          label: "Era Prefix",
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
        { id: "era", label: "Era", valueType: { type: "string" } },
        { id: "year", label: "Year", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = publicEraYearTokenTool.execute;
export default publicEraYearTokenTool;
