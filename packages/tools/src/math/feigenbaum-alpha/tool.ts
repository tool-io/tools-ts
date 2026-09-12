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
        definition:
          "Feigenbaum alpha: signed spatial rescaling constant in standard orientation; magnitude2.5029078751.",
        "approximate-value":
          "Approximate Feigenbaum alpha = -2.5029078751. Rounded off line reference, not arbitrary-precision computation or rigorous error certificate.",
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
  input: { topic: "definition" },
  output: {
    result: {
      text: "Feigenbaum alpha: signed spatial rescaling constant in standard orientation; magnitude2.5029078751.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/feigenbaum-alpha",
  title: "Feigenbaum Alpha Approximation",
  description:
    "Bounded off line reference: Feigenbaum alpha bounded definition/value inventory. Topics: definition, approximate-value. Not live/exhaustive reference, a proof of an open assertion, diagnosis or safe-use approval.",
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
