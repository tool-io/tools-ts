import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, asciiWords } from "../batch51-shared.js";
export type Input = Readonly<{ readonly actualText: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "actualText", label: "Actual text", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  asciiWords(input.actualText);
  return {
    convertedText: input.actualText
      .toLowerCase()
      .replace(/[aeiou]+/g, (v) => "ub" + v),
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualText: "cat apple" },
  output: { result: { convertedText: "cubat ubapplube" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/ubbi-dubbi-converter",
  title: "Ubbi Dubbi Converter",
  description:
    "ExplicitASCIIUbbiDubbivowel-groupubprefix convention Offline bounded explicit text/rule convention,not natural-language validity,personaltrait inference or security.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { convertedText: { type: "string" } },
        required: ["convertedText"],
      },
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
