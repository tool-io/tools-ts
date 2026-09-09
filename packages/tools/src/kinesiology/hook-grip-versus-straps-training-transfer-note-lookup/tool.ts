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
          "Hook grip and lifting straps differ in how hand-bar contact is supported and can affect task transfer and competition eligibility.",
        reference: "Weightlifting training/competition literature.",
        limitations:
          "No recommendation to lift a particular load; actual rules, comfort and technique require qualified review.",
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
      text: "Hook grip and lifting straps differ in how hand-bar contact is supported and can affect task transfer and competition eligibility.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/hook-grip-versus-straps-training-transfer-note-lookup",
  title: "Hook Grip Versus Straps Training Transfer Note Lookup",
  description:
    "Bounded offline reference: Hook grip and lifting straps differ in how hand-bar contact is supported and can affect task transfer and competition eligibility. Source: Weightlifting training/competition literature. No recommendation to lift a particular load; actual rules, comfort and technique require qualified review. Explicit topic keys: summary, reference, limitations. Not a full/current corpus, diagnosis, treatment recommendation or safety certification.",
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
