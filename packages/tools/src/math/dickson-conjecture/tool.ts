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
        statement:
          "Admissible positive-leading-coefficient linear forms are conjectured simultaneously prime infinitely often; local admissibility alone is not sufficient evidence of a proof.",
        scope:
          "This bounded reference does not check or decide the infinite Dickson conjecture. Independently verified mathematical proofs, not a finite calculator, would settle it.",
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
  input: { topic: "statement" },
  output: {
    result: {
      text: "Admissible positive-leading-coefficient linear forms are conjectured simultaneously prime infinitely often; local admissibility alone is not sufficient evidence of a proof.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/dickson-conjecture",
  title: "Dickson Conjecture Checker",
  description:
    "Bounded off line reference: Dickson open conjecture statement/scope, no decidability claim. Topics: statement, scope. Not live/exhaustive reference, a proof of an open assertion, diagnosis or safe-use approval.",
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
