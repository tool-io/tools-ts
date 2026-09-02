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
          "Tiberius and Gaius Gracchus pursued different land, citizenship, grain and institutional measures within 133 and 123\u2013121 BCE contexts.",
        reference:
          "Plutarch, Tiberius and Gaius Gracchus; Appian, Civil Wars 1.",
        limitations:
          "Not a single identical reform package or proof of every later partisan interpretation.",
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
      text: "Tiberius and Gaius Gracchus pursued different land, citizenship, grain and institutional measures within 133 and 123\u2013121 BCE contexts.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/gracchi-brothers-reforms-grain-law-land-limit-outcomes-lookup",
  title: "Gracchi Brothers Reforms Grain Law Land Limit Outcomes Lookup",
  description:
    "Bounded offline reference: Tiberius and Gaius Gracchus pursued different land, citizenship, grain and institutional measures within 133 and 123\u2013121 BCE contexts. Source: Plutarch, Tiberius and Gaius Gracchus; Appian, Civil Wars 1. Not a single identical reform package or proof of every later partisan interpretation. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
