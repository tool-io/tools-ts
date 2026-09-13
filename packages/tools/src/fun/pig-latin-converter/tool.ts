import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, asciiWords } from "../batch51-shared.js";
export type Input = Readonly<{ readonly actualText: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualText", label: "Actual text", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const a = asciiWords(input.actualText);
  return {
    convertedText: a
      .map((w) => {
        if (/^[aeiou]/.test(w)) return w + "way";
        const i = w.search(/[aeiou]/);
        return i < 0 ? w + "ay" : w.slice(i) + w.slice(0, i) + "ay";
      })
      .join(" "),
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
  input: { actualText: "cat apple" },
  output: { result: { convertedText: "atcay appleway" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/pig-latin-converter",
  title: "Pig Latin Converter",
  description:
    "ExplicitlowercaseASCII PigLatin firstwrittenvowelconvention,vowelinitialway,no phonology/quexception inference Offline bounded explicit text/rule convention,not natural-language validity,personaltrait inference or security.",
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
