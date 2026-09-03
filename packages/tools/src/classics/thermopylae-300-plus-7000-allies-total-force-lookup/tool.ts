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
          "The 300Spartiates at Thermopylae were part of a larger allied force; Herodotus 7.202lists contingents and later defenders differ from the initial force.",
        reference: "Herodotus 7.202\u2013222.",
        limitations:
          "Initial force totals and who remained must be distinguished; titles300/7000are not universally exact simultaneous counts.",
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
      text: "The 300Spartiates at Thermopylae were part of a larger allied force; Herodotus 7.202lists contingents and later defenders differ from the initial force.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/thermopylae-300-plus-7000-allies-total-force-lookup",
  title: "Thermopylae 300 Plus 7000 Allies Total Force Lookup",
  description:
    "Offline bounded reference card: The 300Spartiates at Thermopylae were part of a larger allied force; Herodotus 7.202lists contingents and later defenders differ from the initial force. References Herodotus 7.202\u2013222. Initial force totals and who remained must be distinguished; titles300/7000are not universally exact simultaneous counts.",
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
