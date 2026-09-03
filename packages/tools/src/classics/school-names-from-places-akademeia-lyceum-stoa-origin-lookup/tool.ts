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
          "Akademeia names the grove associated with Plato; Lyceum the gymnasium associated with Aristotle; Stoa Poikile the Painted Porch associated with Zeno.",
        reference: "Diogenes Laertius3,5,7.",
        limitations:
          "Place origins are historical naming explanations, not institutional continuity claims.",
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
      text: "Akademeia names the grove associated with Plato; Lyceum the gymnasium associated with Aristotle; Stoa Poikile the Painted Porch associated with Zeno.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/school-names-from-places-akademeia-lyceum-stoa-origin-lookup",
  title: "School Names From Places Akademeia Lyceum Stoa Origin Lookup",
  description:
    "Offline bounded reference card: Akademeia names the grove associated with Plato; Lyceum the gymnasium associated with Aristotle; Stoa Poikile the Painted Porch associated with Zeno. References Diogenes Laertius3,5,7. Place origins are historical naming explanations, not institutional continuity claims.",
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
