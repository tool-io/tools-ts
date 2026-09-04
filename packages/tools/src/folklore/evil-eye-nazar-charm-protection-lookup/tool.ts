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
          "Nazar eye-shaped charms occur in several Mediterranean and nearby cultural traditions.",
        reference: "Dundes, The Evil Eye:A Casebook.",
        limitations:
          "Historical/cultural meaning only; no medical protection or magical efficacy.",
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
      text: "Nazar eye-shaped charms occur in several Mediterranean and nearby cultural traditions.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/evil-eye-nazar-charm-protection-lookup",
  title: "Evil Eye Nazar Charm Protection Lookup",
  description:
    "Bounded offline reference: Nazar eye-shaped charms occur in several Mediterranean and nearby cultural traditions. Source: Dundes, The Evil Eye:A Casebook. Historical/cultural meaning only; no medical protection or magical efficacy. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
