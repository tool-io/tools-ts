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
          "Carroll discusses how interest in the narrative/cognitive aspects of art-horror can coexist with aversive response to its monsters.",
        reference: "Carroll, The Philosophy of Horror 1990.",
        limitations:
          "Not every viewer enjoys horror or a clinical exposure recommendation.",
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
      text: "Carroll discusses how interest in the narrative/cognitive aspects of art-horror can coexist with aversive response to its monsters.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/paradox-of-horror-negative-emotion-enjoyment-carroll-lookup",
  title: "Paradox of Horror Negative Emotion Enjoyment Carroll Lookup",
  description:
    "Bounded offline reference: Carroll discusses how interest in the narrative/cognitive aspects of art-horror can coexist with aversive response to its monsters. Source: Carroll, The Philosophy of Horror 1990. Not every viewer enjoys horror or a clinical exposure recommendation. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
