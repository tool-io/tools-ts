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
    enum: ["occiput", "sacrum", "mentum"],
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        occiput:
          "Cephalic occiput orientation is distinct from head presentation itself.",
        sacrum:
          "Sacrum is a reference landmark in breech position nomenclature.",
        mentum:
          "Mentum is a reference landmark in face presentation nomenclature.",
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
  input: { topic: "occiput" },
  output: {
    result: {
      text: "Cephalic occiput orientation is distinct from head presentation itself.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pregnancy/fetal-position-lookup",
  title: "Fetal Position Lookup",
  description:
    "Bounded offline reference: Fetal position specifies the orientation of a clinically identified reference landmark within maternal pelvic convention. Source: Obstetric anatomical terminology. No automatic examination, delivery recommendation or safe-management conclusion. Explicit topic keys: occiput, sacrum, mentum. Not a full/current corpus, diagnosis, treatment recommendation or safety certification.",
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
