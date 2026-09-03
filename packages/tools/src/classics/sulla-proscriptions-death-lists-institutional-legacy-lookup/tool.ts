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
          "Sullas proscriptions institutionalized named enemies, property confiscation and violent political exclusion in the early80sBCE.",
        reference: "Appian, Civil Wars1; Plutarch, Sulla.",
        limitations:
          "Counts and motives require source criticism; description does not endorse political violence.",
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
      text: "Sullas proscriptions institutionalized named enemies, property confiscation and violent political exclusion in the early80sBCE.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/sulla-proscriptions-death-lists-institutional-legacy-lookup",
  title: "Sulla Proscriptions Death Lists Institutional Legacy Lookup",
  description:
    "Bounded offline reference: Sullas proscriptions institutionalized named enemies, property confiscation and violent political exclusion in the early80sBCE. Source: Appian, Civil Wars1; Plutarch, Sulla. Counts and motives require source criticism; description does not endorse political violence. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
