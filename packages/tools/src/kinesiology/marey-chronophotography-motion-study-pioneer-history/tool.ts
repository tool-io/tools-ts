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
          "Mareys chronophotography and measurement methods contributed to studying movement in time.",
        reference: "Histories of Mareysphysiological motion studies.",
        limitations:
          "Motion images alone do not establish modern joint forces or exclusive invention of motion science.",
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
      text: "Mareys chronophotography and measurement methods contributed to studying movement in time.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/marey-chronophotography-motion-study-pioneer-history",
  title: "Marey Chronophotography Motion Study Pioneer History",
  description:
    "Bounded offline reference: Mareys chronophotography and measurement methods contributed to studying movement in time. Source: Histories of Mareysphysiological motion studies. Motion images alone do not establish modern joint forces or exclusive invention of motion science. Explicit topic keys: summary, reference, limitations. Not a full/current corpus, diagnosis, treatment recommendation or safety certification.",
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
