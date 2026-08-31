import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, textBound } from "../batch-shared.js";
export type Input = Readonly<{ readonly greekPlainText: string }>;
export type Output = Readonly<{
  readonly canonicalSemicolonQuestionMarkText: string;
  readonly observedQuestionMarkCount: number;
  readonly literalGreekQuestionMarkCodePointCount: number;
}>;
const inputFields = [
  { id: "greekPlainText", label: "Greek plain text", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  textBound(input.greekPlainText);
  const native = [...input.greekPlainText].filter((c) => c === ";").length,
    normalized = input.greekPlainText.normalize("NFC");
  return {
    canonicalSemicolonQuestionMarkText: normalized,
    observedQuestionMarkCount: [...normalized].filter((c) => c === ";").length,
    literalGreekQuestionMarkCodePointCount: native,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { greekPlainText: "Πώς; ναι;" } satisfies Input;
export const exampleOutput = {
  canonicalSemicolonQuestionMarkText: "Πώς; ναι;",
  observedQuestionMarkCount: 2,
  literalGreekQuestionMarkCodePointCount: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/greek-question-mark-semicolon-quirk",
  title: "Greek Question Mark Semicolon Quirk",
  description:
    "Audit caller plain Greek punctuation and NFC-normalize U+037E to canonical semicolon question mark; semicolons are interpreted under explicit Greek context, not automatically identified in mixed-language text.",
  inputs: inputFields,
  outputs: [
    {
      id: "canonicalSemicolonQuestionMarkText",
      label: "Canonical semicolon question mark text",
      kind: "string",
    },
    {
      id: "observedQuestionMarkCount",
      label: "Observed question mark count",
      kind: "number",
    },
    {
      id: "literalGreekQuestionMarkCodePointCount",
      label: "Literal greek question mark code point count",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({ greekPlainText: value.greekPlainText as string }),
});
export const run = tool.execute;
export default tool;
