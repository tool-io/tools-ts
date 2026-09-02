import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch43-shared.js";

export type Input = Readonly<{ readonly topic: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "topic", label: "Topic", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        summary:
          "Greek agora and Roman forum are public spaces with civic, commercial, religious and social uses that vary by city and era.",
        reference: "Archaeology of Greek agorai and Roman fora.",
        limitations:
          "Neither is simply a modern shopping plaza; no universal exclusive function.",
      },
      "topic",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { topic: "summary" },
  output: {
    result: {
      text: "Greek agora and Roman forum are public spaces with civic, commercial, religious and social uses that vary by city and era.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/agora-vs-forum-function-comparison-lookup",
  title: "Agora vs Forum Function Comparison Lookup",
  description:
    "Offline bounded reference card: Greek agora and Roman forum are public spaces with civic, commercial, religious and social uses that vary by city and era. References Archaeology of Greek agorai and Roman fora. Neither is simply a modern shopping plaza; no universal exclusive function.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
