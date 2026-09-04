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
          "Ancient coin-for-the-ferryman accounts and archaeological placements differ; coins are not uniformly placed over both eyes.",
        reference:
          "Greek/Roman Charon-obol literary and burial archaeology scholarship.",
        limitations:
          "A literary motif does not establish the identity, belief or date of every coin-bearing burial.",
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
      text: "Ancient coin-for-the-ferryman accounts and archaeological placements differ; coins are not uniformly placed over both eyes.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/coins-for-the-ferryman-mouth-versus-eyes-placement-variants",
  title: "Coins For the Ferryman Mouth Versus Eyes Placement Variants",
  description:
    "Bounded offline reference: Ancient coin-for-the-ferryman accounts and archaeological placements differ; coins are not uniformly placed over both eyes. Source: Greek/Roman Charon-obol literary and burial archaeology scholarship. A literary motif does not establish the identity, belief or date of every coin-bearing burial. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
