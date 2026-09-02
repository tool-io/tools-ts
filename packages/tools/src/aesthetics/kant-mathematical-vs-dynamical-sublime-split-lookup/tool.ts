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
          "Kants mathematical sublime concerns magnitude; dynamical sublime concerns might relative to our reflective capacities.",
        reference: "Kant, Critique of Judgment, sections25\u201329.",
        limitations:
          "Not measurements of personal worth or permission for dangerous exposure.",
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
      text: "Kants mathematical sublime concerns magnitude; dynamical sublime concerns might relative to our reflective capacities.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/kant-mathematical-vs-dynamical-sublime-split-lookup",
  title: "Kant Mathematical vs Dynamical Sublime Split Lookup",
  description:
    "Bounded offline reference: Kants mathematical sublime concerns magnitude; dynamical sublime concerns might relative to our reflective capacities. Source: Kant, Critique of Judgment, sections25\u201329. Not measurements of personal worth or permission for dangerous exposure. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
