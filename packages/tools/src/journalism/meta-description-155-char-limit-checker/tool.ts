import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish } from "../batch52-shared.js";
export type Input = Readonly<{ readonly descriptionText: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "descriptionText", label: "Description text", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  const n = [...i.descriptionText].length;
  return {
    unicodeCodepointCount: n,
    exceedsIllustrative155: n > 155,
    searchSnippetGuaranteed: false,
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { descriptionText: "Example" },
  output: {
    result: {
      unicodeCodepointCount: 7,
      exceedsIllustrative155: false,
      searchSnippetGuaranteed: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/meta-description-155-char-limit-checker",
  title: "Meta Description 155 Char Limit Checker",
  description:
    "Explicit illustrative 155-codepoint metadata budget; not a search-engine limit or snippet-display guarantee.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
