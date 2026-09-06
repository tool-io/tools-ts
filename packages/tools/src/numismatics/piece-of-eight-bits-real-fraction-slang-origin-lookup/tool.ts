import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch45-shared.js";
export type Input = Readonly<{ readonly topic: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "topic",
    label: "Topic",
    kind: "string",
    enum: ["summary", "reference", "limitations"],
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        summary:
          "Piece of eight denotes the Spanish eight-real silver denomination; two bits conventionally refers to a quarter-dollar in US usage.",
        reference: "Spanish-American monetary histories.",
        limitations:
          "Slang/cutting practices and accounting equivalences are contextual, not legal convertibility for every surviving coin.",
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
      text: "Piece of eight denotes the Spanish eight-real silver denomination; two bits conventionally refers to a quarter-dollar in US usage.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/piece-of-eight-bits-real-fraction-slang-origin-lookup",
  title: "Piece of Eight Bits Real Fraction Slang Origin Lookup",
  description:
    "Bounded offline reference: Piece of eight denotes the Spanish eight-real silver denomination; two bits conventionally refers to a quarter-dollar in US usage. Source: Spanish-American monetary histories. Slang/cutting practices and accounting equivalences are contextual, not legal convertibility for every surviving coin. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
