import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded, codepoints } from "../batch-shared.js";
export type Input = Readonly<{
  readonly slugText: string;
  readonly callerMaximumSlugCharacters: number;
}>;
export type Output = Readonly<{
  readonly slugCodepointLength: number;
  readonly conservativeLowercaseAsciiHyphenSyntaxValid: boolean;
  readonly withinCallerSlugLength: boolean;
  readonly callerSlugPolicySatisfied: boolean;
}>;
const inputFields = [
  { id: "slugText", label: "Slug text", kind: "string" },
  {
    id: "callerMaximumSlugCharacters",
    label: "Caller maximum slug characters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.callerMaximumSlugCharacters, "limit", 1, 1000);
  const count = codepoints(input.slugText).length,
    syntax = /^[a-z0-9]+(?:-[a-z0-9]+)*$(?![\s\S])/.test(input.slugText),
    within = count <= input.callerMaximumSlugCharacters;
  return {
    slugCodepointLength: count,
    conservativeLowercaseAsciiHyphenSyntaxValid: syntax,
    withinCallerSlugLength: within,
    callerSlugPolicySatisfied: syntax && within,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  slugText: "city-budget-vote",
  callerMaximumSlugCharacters: 20,
} satisfies Input;
export const exampleOutput = {
  slugCodepointLength: 16,
  conservativeLowercaseAsciiHyphenSyntaxValid: true,
  withinCallerSlugLength: true,
  callerSlugPolicySatisfied: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/slug-url-length-hyphen-best-practice-checker",
  title: "Slug URL Length Hyphen Best Practice Checker",
  description:
    "Audit actual URL slug under explicit conservative lowercase-ASCII single-hyphen token grammar and caller length budget; not all RFC-valid URL paths, Unicode transliteration, routing safety or an SEO ranking rule.",
  inputs: inputFields,
  outputs: [
    {
      id: "slugCodepointLength",
      label: "Slug codepoint length",
      kind: "number",
    },
    {
      id: "conservativeLowercaseAsciiHyphenSyntaxValid",
      label: "Conservative lowercase ascii hyphen syntax valid",
      kind: "boolean",
    },
    {
      id: "withinCallerSlugLength",
      label: "Within caller slug length",
      kind: "boolean",
    },
    {
      id: "callerSlugPolicySatisfied",
      label: "Caller slug policy satisfied",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      slugText: value.slugText as string,
      callerMaximumSlugCharacters: value.callerMaximumSlugCharacters as number,
    }),
});
export const run = tool.execute;
export default tool;
