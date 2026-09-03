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
          "Plebeian tribunes exercised intercessio and were regarded as sacrosanct within specific Republican institutions.",
        reference: "Livy 2.33; Cicero, De legibus 3.",
        limitations:
          "Scope and exceptions vary; not modern legal immunity or universal veto authority.",
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
      text: "Plebeian tribunes exercised intercessio and were regarded as sacrosanct within specific Republican institutions.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/tribune-plebs-veto-sacrosanctity-lookup",
  title: "Tribune Plebs Veto Sacrosanctity Lookup",
  description:
    "Offline bounded reference card: Plebeian tribunes exercised intercessio and were regarded as sacrosanct within specific Republican institutions. References Livy 2.33; Cicero, De legibus 3. Scope and exceptions vary; not modern legal immunity or universal veto authority.",
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
