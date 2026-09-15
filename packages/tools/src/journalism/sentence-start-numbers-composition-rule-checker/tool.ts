import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly sentence: string;
  readonly callerAllowsDigitStarts: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "sentence", label: "Sentence", kind: "string" },
  {
    id: "callerAllowsDigitStarts",
    label: "Caller allows digit starts",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  return {
    startsWithAsciiDigit: /^\s*[0-9]/.test(i.sentence),
    callerStyleReview:
      /^\s*[0-9]/.test(i.sentence) && !i.callerAllowsDigitStarts,
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { sentence: "12 people arrived.", callerAllowsDigitStarts: false },
  output: { result: { startsWithAsciiDigit: true, callerStyleReview: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/sentence-start-numbers-composition-rule-checker",
  title: "Sentence Start Numbers Composition Rule Checker",
  description:
    "Simple explicit sentence-start digit flag versus caller style choice; quotes/signs, year exceptions, sentence segmentation and rewriting omitted.",
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
