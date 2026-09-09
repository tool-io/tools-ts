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
          "Handstand line cues describe one coaching approach to the relationship between arms, head, trunk and support.",
        reference: "Gymnastics coaching literature.",
        limitations:
          "Head-through-arms wording does not prescribe a safe joint range or establish an optimal line for everyone.",
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
      text: "Handstand line cues describe one coaching approach to the relationship between arms, head, trunk and support.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/handstand-line-blocks-head-through-arm-cue-lookup",
  title: "Handstand Line Blocks Head Through Arm Cue Lookup",
  description:
    "Bounded offline reference: Handstand line cues describe one coaching approach to the relationship between arms, head, trunk and support. Source: Gymnastics coaching literature. Head-through-arms wording does not prescribe a safe joint range or establish an optimal line for everyone. Explicit topic keys: summary, reference, limitations. Not a full/current corpus, diagnosis, treatment recommendation or safety certification.",
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
