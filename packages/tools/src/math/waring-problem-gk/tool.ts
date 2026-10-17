import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch50-shared.js";
export type Input = Readonly<{ readonly topic: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "topic", label: "Topic", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  return {
    text: pick(
      input.topic,
      {
        definition:
          "Waring G(k) is the least number of kth powers of nonnegative integers sufficient for all sufficiently large integers. It is distinct from g(k), which covers every nonnegative integer.",
        scope:
          "General exact G(k) values are not known by a universal closed formula. The expression 2^k+floor((3/2)^k)-2 concerns classical g(k), not an automatic answer for G(k).",
      },
      "topic",
    ),
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { topic: "definition" },
  output: {
    result: {
      text: "Waring G(k) is the least number of kth powers of nonnegative integers sufficient for all sufficiently large integers. It is distinct from g(k), which covers every nonnegative integer.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/waring-problem-gk",
  title: "Waring Problem G(k) Calculator",
  description:
    "Bounded off line reference: WaringG(k) definition and premise correction. Topics: definition, scope. Not live/exhaustive reference, a proof of an open assertion, diagnosis or safe-use approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { text: { type: "string" } },
        required: ["text"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
