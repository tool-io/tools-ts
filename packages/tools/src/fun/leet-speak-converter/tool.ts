import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish } from "../batch51-shared.js";
export type Input = Readonly<{ readonly actualText: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualText", label: "Actual text", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  return {
    convertedText: input.actualText.replace(
      /[aeiost]/gi,
      (c) =>
        (
          ({ a: "4", e: "3", i: "1", o: "0", s: "5", t: "7" }) as Record<
            string,
            string
          >
        )[c.toLowerCase()],
    ),
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
  input: { actualText: "test" },
  output: { result: { convertedText: "7357" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/leet-speak-converter",
  title: "Leet Speak Converter",
  description:
    "Bounded leetsixletterreplacementa/e/i/o/s/t Offline bounded explicit text/rule convention,not natural-language validity,personaltrait inference or security.",
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
