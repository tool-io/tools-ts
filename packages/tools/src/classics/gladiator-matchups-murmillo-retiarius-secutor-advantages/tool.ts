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
          "Retiarius uses net/trident imagery; secutor is commonly associated with pursuit of retiarius; murmillo has distinct shield/helmet equipment.",
        reference:
          "Gladiatorial iconography; Junkelmann, Das Spiel mit dem Tod.",
        limitations:
          "No combat instructions, probability of winning or universal match-up rule.",
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
      text: "Retiarius uses net/trident imagery; secutor is commonly associated with pursuit of retiarius; murmillo has distinct shield/helmet equipment.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/gladiator-matchups-murmillo-retiarius-secutor-advantages",
  title: "Gladiator Matchups Murmillo Retiarius Secutor Advantages",
  description:
    "Offline bounded reference card: Retiarius uses net/trident imagery; secutor is commonly associated with pursuit of retiarius; murmillo has distinct shield/helmet equipment. References Gladiatorial iconography; Junkelmann, Das Spiel mit dem Tod. No combat instructions, probability of winning or universal match-up rule.",
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
