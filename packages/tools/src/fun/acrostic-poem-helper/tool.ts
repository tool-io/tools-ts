import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualAcrosticWord: string;
  readonly actualPoemLines: readonly string[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "actualAcrosticWord", label: "Actual acrostic word", kind: "string" },
  { id: "actualPoemLines", label: "Actual poem lines", kind: "stringList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  const a = Array.from(input.actualAcrosticWord.toUpperCase());
  aligned(a, input.actualPoemLines, "lines");
  return {
    matchesAcrostic: a.every((c, i) =>
      input.actualPoemLines[i].trim().toUpperCase().startsWith(c),
    ),
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    actualAcrosticWord: "CAT",
    actualPoemLines: ["Clouds drift", "A light shines", "Trees listen"],
  },
  output: { result: { matchesAcrostic: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/acrostic-poem-helper",
  title: "Acrostic Poem Helper",
  description:
    "Actualfirstletterlineacrosticcheck,punctuationmustnotprecedeletters,no automaticpoetryquality. Offline bounded explicit text/rule convention,not natural-language validity,personaltrait inference or security.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { matchesAcrostic: { type: "boolean" } },
        required: ["matchesAcrostic"],
      },
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
