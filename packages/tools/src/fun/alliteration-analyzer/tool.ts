import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch51-shared.js";
export type Input = Readonly<{ readonly actualAsciiWords: readonly string[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualAsciiWords", label: "Actual ascii words", kind: "stringList" },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  if (
    !input.actualAsciiWords.length ||
    input.actualAsciiWords.some((v) => !/^[A-Za-z]+$/.test(v))
  )
    simpleError("words", "NonemptyASCIIwordtokens.");
  const c = input.actualAsciiWords[0][0].toLowerCase();
  return {
    initialLetter: c,
    sameInitialWordCount: input.actualAsciiWords.filter(
      (v) => v[0].toLowerCase() === c,
    ).length,
    totalWords: input.actualAsciiWords.length,
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualAsciiWords: ["blue", "birds", "bring", "bread"] },
  output: {
    result: { initialLetter: "b", sameInitialWordCount: 4, totalWords: 4 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/alliteration-analyzer",
  title: "Alliteration Analyzer Fun",
  description:
    "Declaredspellinginitialalliterationcountrelativefirstword,not phoneticalliteration (city/cat differ). Offline bounded explicit text/rule convention,not natural-language validity,personaltrait inference or security.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
