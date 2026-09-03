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
          "Stoic, Epicurean, Academic and Peripatetic name distinct Hellenistic philosophical traditions with internal debates and historical development.",
        reference: "Diogenes Laertius, Lives of Eminent Philosophers.",
        limitations:
          "Labels do not encode every thinker or a modern psychological personality type.",
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
      text: "Stoic, Epicurean, Academic and Peripatetic name distinct Hellenistic philosophical traditions with internal debates and historical development.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/hellenistic-schools-stoic-epicurean-academic-peripatetic-lookup",
  title: "Hellenistic Schools Stoic Epicurean Academic Peripatetic Lookup",
  description:
    "Offline bounded reference card: Stoic, Epicurean, Academic and Peripatetic name distinct Hellenistic philosophical traditions with internal debates and historical development. References Diogenes Laertius, Lives of Eminent Philosophers. Labels do not encode every thinker or a modern psychological personality type.",
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
