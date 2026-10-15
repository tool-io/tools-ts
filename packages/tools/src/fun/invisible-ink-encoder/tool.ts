import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish } from "../batch51-shared.js";
export type Input = Readonly<{ readonly actualText: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "actualText", label: "Actual text", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  return {
    convertedText: Array.from(input.actualText)
      .map((c) => c.codePointAt(0)!.toString(2).padStart(21, "0"))
      .join("")
      .replace(/0/g, "\u200b")
      .replace(/1/g, "\u200c"),
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualText: "A" },
  output: {
    result: {
      convertedText:
        "\u200b\u200b\u200b\u200b\u200b\u200b\u200b\u200b\u200b\u200b\u200b\u200b\u200b\u200b\u200c\u200b\u200b\u200b\u200b\u200b\u200c",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/invisible-ink-encoder",
  title: "Secret Message Invisible Ink Encoder",
  description:
    "21bitcodepointzero-widthbinaryencoding,not encryption or invisibleacrossallrenderers Offline bounded explicit text/rule convention,not natural-language validity,personaltrait inference or security.",
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
