import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, exactTranslations } from "../batch43-shared.js";

export type Input = Readonly<{
  readonly queryTerms: readonly string[];
  readonly callerVerifiedSourceTerms: readonly string[];
  readonly callerVerifiedTargetTerms: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "queryTerms", label: "Query terms", kind: "stringList" },
  {
    id: "callerVerifiedSourceTerms",
    label: "Caller verified source terms",
    kind: "stringList",
  },
  {
    id: "callerVerifiedTargetTerms",
    label: "Caller verified target terms",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    mappedTerms: exactTranslations(
      input.queryTerms,
      input.callerVerifiedSourceTerms,
      input.callerVerifiedTargetTerms,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    queryTerms: ["a", "b"],
    callerVerifiedSourceTerms: ["a", "b"],
    callerVerifiedTargetTerms: ["x", "y"],
  },
  output: { result: { mappedTerms: ["x", "y"] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "heraldry/french-english-cross-mapper",
  title: "French-English Blazon Term Cross-Mapper",
  description:
    "Exact caller verified edition-specific FrenchEnglishBlazoncrosswalk; no unrestricted translation or historical abbreviation ambiguity resolution.",
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
