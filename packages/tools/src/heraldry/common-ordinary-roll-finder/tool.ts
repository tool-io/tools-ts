import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, histogram } from "../batch43-shared.js";

export type Input = Readonly<{
  readonly annotatedOrdinaryNames: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "annotatedOrdinaryNames",
    label: "Annotated ordinary names",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  const h = histogram(input.annotatedOrdinaryNames),
    m = Math.max(...h.counts);
  return {
    mostCommonOrdinaries: h.tokens.filter((_, i) => h.counts[i] === m),
    maximumOccurrences: m,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { annotatedOrdinaryNames: ["fess", "pale", "fess"] },
  output: { result: { mostCommonOrdinaries: ["fess"], maximumOccurrences: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "heraldry/common-ordinary-roll-finder",
  title: "Most Common Ordinary Across Roll Finder",
  description:
    "Count independently annotated ordinary occurrences and retain every exact mode, not a lexical blazon parser.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
