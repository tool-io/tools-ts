import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch44-shared.js";

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
          "Diogenes lantern and plucked-chicken stories are transmitted anecdotes illustrating Cynic provocation.",
        reference: "Diogenes Laertius 6.",
        limitations:
          "Later anecdote collections are not independent contemporary proof of each episode or ethical permission to mistreat people/animals.",
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
      text: "Diogenes lantern and plucked-chicken stories are transmitted anecdotes illustrating Cynic provocation.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/diogenes-cynic-lantern-platos-chicken-anecdotes-lookup",
  title: "Diogenes Cynic Lantern Platos Chicken Anecdotes Lookup",
  description:
    "Bounded offline reference: Diogenes lantern and plucked-chicken stories are transmitted anecdotes illustrating Cynic provocation. Source: Diogenes Laertius 6. Later anecdote collections are not independent contemporary proof of each episode or ethical permission to mistreat people/animals. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
