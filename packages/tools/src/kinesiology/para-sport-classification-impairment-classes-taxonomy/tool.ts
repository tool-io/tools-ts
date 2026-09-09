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
          "Para-sport classification groups eligible impairment effects according to sport-specific rules and assessment.",
        reference:
          "International Paralympic Committee classification framework.",
        limitations:
          "Impairment labels alone do not establish eligibility, class assignment or comparative athlete worth.",
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
      text: "Para-sport classification groups eligible impairment effects according to sport-specific rules and assessment.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/para-sport-classification-impairment-classes-taxonomy",
  title: "Para Sport Classification Impairment Classes Taxonomy",
  description:
    "Bounded offline reference: Para-sport classification groups eligible impairment effects according to sport-specific rules and assessment. Source: International Paralympic Committee classification framework. Impairment labels alone do not establish eligibility, class assignment or comparative athlete worth. Explicit topic keys: summary, reference, limitations. Not a full/current corpus, diagnosis, treatment recommendation or safety certification.",
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
