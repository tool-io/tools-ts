import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch51-shared.js";
export type Input = Readonly<{ readonly actualAsciiWord: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualAsciiWord", label: "Actual ascii word", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  if (!input.actualAsciiWord.trim())
    simpleError("actualAsciiWord", "Explicitnonblanktextrequired.");
  if (!/^[A-Za-z]+$/.test(input.actualAsciiWord))
    simpleError("word", "ASCIIword.");
  return { value: new Set(input.actualAsciiWord.toLowerCase()).size };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualAsciiWord: "apple" },
  output: { result: { value: 4 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/hangman-difficulty",
  title: "Hangman Word Difficulty Rater",
  description:
    "DeclaredhangmanDISTINCT-letter-countcomplexityproxy,not wordfrequency/actualhumanpuzzledifficulty.",
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
