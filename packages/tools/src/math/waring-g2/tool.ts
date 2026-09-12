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
        result:
          "G(2)=4: four squares suffice and arbitrarily large integers cannot all be represented by three squares.",
        definition:
          "G(k) concerns all sufficiently large integers; g(k) concerns all nonnegative integers. Finite enumeration cannot by itself certify either universal quantity.",
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
  input: { topic: "result" },
  output: {
    result: {
      text: "G(2)=4: four squares suffice and arbitrarily large integers cannot all be represented by three squares.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/waring-g2",
  title: "Waring G(2) Calculator",
  description:
    "Bounded off line reference: Waring asymptotic power representation result/bounds. Topics: result, definition. Not live/exhaustive reference, a proof of an open assertion, diagnosis or safe-use approval.",
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
