import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch50-shared.js";
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
        scope:
          "Skewes numbers are historical enormous upper bounds for the first pi(x)>li(x) crossover under different assumptions; they are not exact first crossover locations.",
        "historical-rh-bound":
          "Historical RH-conditional Skewes bound is exp(exp(exp(79))); do not evaluate as a representable JavaScript number or claim this is a current sharp bound.",
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
  input: { topic: "scope" },
  output: {
    result: {
      text: "Skewes numbers are historical enormous upper bounds for the first pi(x)>li(x) crossover under different assumptions; they are not exact first crossover locations.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/skewes-number-approx",
  title: "Skewes Number Approximation",
  description:
    "Bounded off line reference: historicalSkewesbound symbolic reference, not floating overflow as number. Topics: scope, historical-rh-bound. Not live/exhaustive reference, a proof of an open assertion, diagnosis or safe-use approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
