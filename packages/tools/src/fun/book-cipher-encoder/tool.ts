import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualAsciiMessage: string;
  readonly actualAsciiBookText: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualAsciiMessage", label: "Actual ascii message", kind: "string" },
  {
    id: "actualAsciiBookText",
    label: "Actual ascii book text",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  if (
    !/^[A-Za-z]+$/.test(input.actualAsciiMessage) ||
    !/^[A-Za-z ]+$/.test(input.actualAsciiBookText)
  )
    simpleError("book", "ExplicitASCIIlettermessage/referencebookbranch.");
  const b = input.actualAsciiBookText.toLowerCase();
  return {
    zeroBasedFirstBookCodepointPositions: Array.from(
      input.actualAsciiMessage.toLowerCase(),
    ).map((c) => {
      const i = b.indexOf(c);
      if (i < 0)
        simpleError("message", "Referencebookmustcontainactualletters.");
      return i;
    }),
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
  input: { actualAsciiMessage: "cab", actualAsciiBookText: "abc" },
  output: { result: { zeroBasedFirstBookCodepointPositions: [2, 0, 1] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/book-cipher-encoder",
  title: "Book Cipher Encoder Fun",
  description:
    "Declaredfirst-CHARACTERindexbookcipher,not word/pagecode,multiplelocationrandomization or secure encryption. Offline bounded explicit text/rule convention,not natural-language validity,personaltrait inference or security.",
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
