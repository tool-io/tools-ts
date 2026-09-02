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
          "Roman augural bird observations could be organized by witnessed signs and ritually specified observation spaces.",
        reference: "Cicero, De divinatione1\u20132.",
        limitations:
          "Historical description only; no divinatory validity or predictive power established.",
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
      text: "Roman augural bird observations could be organized by witnessed signs and ritually specified observation spaces.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/augury-bird-template-auspex-observation-types",
  title: "Augury Bird Template Auspex Observation Types",
  description:
    "Offline bounded reference card: Roman augural bird observations could be organized by witnessed signs and ritually specified observation spaces. References Cicero, De divinatione1\u20132. Historical description only; no divinatory validity or predictive power established.",
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
