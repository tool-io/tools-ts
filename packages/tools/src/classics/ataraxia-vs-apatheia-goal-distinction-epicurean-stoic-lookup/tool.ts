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
          "Ataraxia means freedom from disturbance; apatheia in Stoic discourse concerns freedom from disordered passions, not absence of all feeling.",
        reference: "Epicurus, Letter to Menoeceus; Diogenes Laertius 7.",
        limitations:
          "Goals and usage vary across schools; not mental-health treatment or modern apathy diagnosis.",
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
      text: "Ataraxia means freedom from disturbance; apatheia in Stoic discourse concerns freedom from disordered passions, not absence of all feeling.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/ataraxia-vs-apatheia-goal-distinction-epicurean-stoic-lookup",
  title: "Ataraxia vs Apatheia Goal Distinction Epicurean Stoic Lookup",
  description:
    "Offline bounded reference card: Ataraxia means freedom from disturbance; apatheia in Stoic discourse concerns freedom from disordered passions, not absence of all feeling. References Epicurus, Letter to Menoeceus; Diogenes Laertius 7. Goals and usage vary across schools; not mental-health treatment or modern apathy diagnosis.",
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
