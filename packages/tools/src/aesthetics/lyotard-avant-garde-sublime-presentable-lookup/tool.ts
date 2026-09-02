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
          "Lyotard relates avant-garde sublime problems to presenting that there is something unpresentable.",
        reference: "Lyotard, The Sublime and the Avant-Garde.",
        limitations:
          "Interpretation varies; no automatic formal test of avant-garde authenticity.",
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
      text: "Lyotard relates avant-garde sublime problems to presenting that there is something unpresentable.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/lyotard-avant-garde-sublime-presentable-lookup",
  title: "Lyotard Avant Garde Sublime Presentable Lookup",
  description:
    "Bounded offline reference: Lyotard relates avant-garde sublime problems to presenting that there is something unpresentable. Source: Lyotard, The Sublime and the Avant-Garde. Interpretation varies; no automatic formal test of avant-garde authenticity. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
