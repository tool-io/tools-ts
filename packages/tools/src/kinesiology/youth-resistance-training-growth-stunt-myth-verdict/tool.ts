import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch47-shared.js";
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
          "Appropriately designed, supervised youth resistance training is not shown to universally stunt growth.",
        reference: "Youth resistance-training consensus literature.",
        limitations:
          "This is not permission for unsafe loading; maturity, technique, supervision and health context matter.",
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
      text: "Appropriately designed, supervised youth resistance training is not shown to universally stunt growth.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/youth-resistance-training-growth-stunt-myth-verdict",
  title: "Youth Resistance Training Growth Stunt Myth Verdict",
  description:
    "Bounded offline reference: Appropriately designed, supervised youth resistance training is not shown to universally stunt growth. Source: Youth resistance-training consensus literature. This is not permission for unsafe loading; maturity, technique, supervision and health context matter. Explicit topic keys: summary, reference, limitations. Not a full/current corpus, diagnosis, treatment recommendation or safety certification.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
