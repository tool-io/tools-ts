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
          "A ring-on-string pendulum does not provide a scientifically established way to predict a babys sex or gender.",
        reference:
          "Evidence-based prenatal information; ideomotor-effect research.",
        limitations:
          "Sex and gender are not interchangeable; no prenatal diagnosis or reassurance inferred.",
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
      text: "A ring-on-string pendulum does not provide a scientifically established way to predict a babys sex or gender.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/ring-on-string-gender-prediction-old-wives-myth-checker",
  title: "Ring On String Gender Prediction Old Wives Myth Checker",
  description:
    "Bounded offline reference: A ring-on-string pendulum does not provide a scientifically established way to predict a babys sex or gender. Source: Evidence-based prenatal information; ideomotor-effect research. Sex and gender are not interchangeable; no prenatal diagnosis or reassurance inferred. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
