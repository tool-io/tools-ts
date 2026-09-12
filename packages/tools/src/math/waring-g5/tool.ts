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
          "Conservative unconditional bound 1<=G(5)<=37 follows from the universal representation bound g(5)=37. This is not a claim of sharpness or an exact G(5).",
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
      text: "Conservative unconditional bound 1<=G(5)<=37 follows from the universal representation bound g(5)=37. This is not a claim of sharpness or an exact G(5).",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/waring-g5",
  title: "Waring G(5) Calculator",
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
