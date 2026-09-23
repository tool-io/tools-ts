import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly token: string };
export type Output = {
  readonly author: string;
  readonly year: number;
  readonly bracketed: boolean;
};
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
    author: { type: "string", maxLength: 8192 },
    year: { type: "integer" },
    bracketed: { type: "boolean" },
  },
  required: ["author", "year", "bracketed"],
} as const;
/** Parse a supplied author/year token without asserting its taxonomic meaning. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token } = request;
  const compute = (): Output => {
    const bracketed = token.startsWith("(") && token.endsWith(")"),
      inner = bracketed ? token.slice(1, -1) : token,
      match = /^([^(),]+), ([1-9]\d{3})(?![\s\S])/.exec(inner);
    H.domain(match, "token");
    return { author: match[1], year: Number(match[2]), bracketed };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "(Smith, 1900)" },
  output: { author: "Smith", year: 1900, bracketed: true },
} satisfies ToolExample<Input, Output>;
export const taxonAuthorshipYearBracketPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biosystematics/taxon-authorship-year-bracket-pair",
    title: "Taxon Authorship Year Bracket Pair Tool",
    description:
      "Parse a supplied author/year token without asserting its taxonomic meaning.",
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
        author: { type: "string", maxLength: 8192 },
        year: { type: "integer" },
        bracketed: { type: "boolean" },
      },
      required: ["author", "year", "bracketed"],
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
        { id: "author", label: "Author", valueType: { type: "string" } },
        { id: "year", label: "Year", valueType: { type: "integer" } },
        { id: "bracketed", label: "Bracketed", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = taxonAuthorshipYearBracketPairTool.execute;
export default taxonAuthorshipYearBracketPairTool;
