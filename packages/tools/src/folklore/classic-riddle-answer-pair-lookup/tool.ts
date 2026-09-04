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
        sphinx:
          "Human:the conventional four/two/three legs life-stage interpretation.",
        keysWithoutLocks: "Piano:one common answer to keys without locks.",
        moreYouTake:
          "Footsteps:one common answer to the more you take, the more you leave behind.",
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
  input: { topic: "sphinx" },
  output: {
    result: {
      text: "Human:the conventional four/two/three legs life-stage interpretation.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/classic-riddle-answer-pair-lookup",
  title: "Classic Riddle Answer Pair Lookup",
  description:
    "Bounded offline reference: A bounded public-domain riddle inventory supports exact keys. Source: Traditional riddle collections; Greek Sphinx narrative. Answers can vary by wording; no inference from arbitrary riddle text. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
