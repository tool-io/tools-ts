import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch45-shared.js";
export type Input = Readonly<{ readonly topic: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "topic",
    label: "Topic",
    kind: "string",
    enum: ["summary", "reference", "limitations"],
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        summary:
          "Salutatio linked patron/client morning visiting; sportula could refer to distributions whose form changed over time.",
        reference: "Martial; Juvenal; Roman patronage scholarship.",
        limitations:
          "Not every client received a literal grain basket or followed identical obligations.",
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
      text: "Salutatio linked patron/client morning visiting; sportula could refer to distributions whose form changed over time.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/morning-salutatio-clientela-sportula-grain-basket-custom",
  title: "Morning Salutatio Clientela Sportula Grain Basket Custom",
  description:
    "Bounded offline reference: Salutatio linked patron/client morning visiting; sportula could refer to distributions whose form changed over time. Source: Martial; Juvenal; Roman patronage scholarship. Not every client received a literal grain basket or followed identical obligations. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
