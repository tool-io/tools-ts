import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, mean, pick } from "../batch44-shared.js";

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
        courage: "Courage is discussed between cowardice and rashness.",
        temperance:
          "Temperance is discussed against self-indulgence and deficient sensitivity.",
        generosity:
          "Generosity is discussed between wastefulness and meanness.",
        limitation:
          "The appropriate mean is relative to us and practical judgment, not fixed numerical midway behavior.",
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
  input: { topic: "courage" },
  output: {
    result: { text: "Courage is discussed between cowardice and rashness." },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/aristotle-golden-mean-vices-extremes-table-lookup",
  title: "Aristotle Golden Mean Vices Extremes Table Lookup",
  description:
    "Bounded offline reference: Aristotles mean concerns a context-relative excellence between relevant excess/deficiency, not an arithmetic average. Source: Aristotle, Nicomachean Ethics2\u20134. Not every action/emotion admits a mean; examples depend on translation and situation. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
