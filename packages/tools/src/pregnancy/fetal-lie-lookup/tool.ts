import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick, aligned } from "../batch47-shared.js";
export type Input = Readonly<{ readonly topic: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "topic",
    label: "Topic",
    kind: "string",
    enum: ["longitudinal", "transverse", "oblique"],
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        longitudinal: "Axes broadly aligned.",
        transverse: "Axes broadly crosswise.",
        oblique:
          "Intermediate oblique relationship; actual presentation/context separate.",
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
  input: { topic: "longitudinal" },
  output: { result: { text: "Axes broadly aligned." } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pregnancy/fetal-lie-lookup",
  title: "Fetal Lie Lookup",
  description:
    "Bounded offline reference: Fetal lie describes the relationship between fetal and maternal longitudinal axes. Source: Obstetric anatomical terminology. No automatic examination, delivery recommendation or safe-management conclusion. Explicit topic keys: longitudinal, transverse, oblique. Not a full/current corpus, diagnosis, treatment recommendation or safety certification.",
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
