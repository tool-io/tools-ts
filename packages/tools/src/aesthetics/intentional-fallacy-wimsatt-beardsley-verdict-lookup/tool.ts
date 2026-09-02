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
          "Wimsatt and Beardsley argue that authorial intention should not serve as the decisive external standard for interpreting a poem.",
        reference: "Wimsatt and Beardsley, The Intentional Fallacy 1946.",
        limitations:
          "A contested critical argument, not proof that historical intention evidence is always irrelevant.",
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
      text: "Wimsatt and Beardsley argue that authorial intention should not serve as the decisive external standard for interpreting a poem.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/intentional-fallacy-wimsatt-beardsley-verdict-lookup",
  title: "Intentional Fallacy Wimsatt Beardsley Verdict Lookup",
  description:
    "Bounded offline reference: Wimsatt and Beardsley argue that authorial intention should not serve as the decisive external standard for interpreting a poem. Source: Wimsatt and Beardsley, The Intentional Fallacy 1946. A contested critical argument, not proof that historical intention evidence is always irrelevant. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
