import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly term: string;
  readonly source: string;
  readonly year: number;
};
export type Output = { readonly tag: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    term: { type: "string", maxLength: 8192 },
    source: { type: "string", maxLength: 8192 },
    year: { type: "integer", minimum: -100000, maximum: 9999 },
  },
  required: ["term", "source", "year"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tag: { type: "string", maxLength: 8192 } },
  required: ["tag"],
} as const;
/** Attach explicit source and year context to historical terminology without endorsing or applying it to a person. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { term, source, year } = request;
  const compute = (): Output => {
    H.domain(term.length > 0 && source.length > 0, "term");
    (H.domain(
      Number.isSafeInteger(year) && year >= -100000 && year <= 9999,
      "year",
    ),
      year);
    return { tag: JSON.stringify(term) + " [" + source + ", " + year + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { term: "historical term", source: "Archive A", year: 1920 },
  output: { tag: '"historical term" [Archive A, 1920]' },
} satisfies ToolExample<Input, Output>;
export const genderTermHistoricalSourceTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gender-studies/gender-term-historical-source-tag",
    title: "Gender Term Historical Source Tag Tool",
    description:
      "Attach explicit source and year context to historical terminology without endorsing or applying it to a person.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        term: { type: "string", maxLength: 8192 },
        source: { type: "string", maxLength: 8192 },
        year: { type: "integer", minimum: -100000, maximum: 9999 },
      },
      required: ["term", "source", "year"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { tag: { type: "string", maxLength: 8192 } },
      required: ["tag"],
    },
    ports: {
      inputs: [
        {
          id: "term",
          label: "Term",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "year",
          label: "Year",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "tag", label: "Tag", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = genderTermHistoricalSourceTagTool.execute;
export default genderTermHistoricalSourceTagTool;
