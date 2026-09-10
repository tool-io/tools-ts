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
    enum: ["cephalic", "breech", "shoulder"],
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        cephalic:
          "Head-presenting; subtypes require actual clinical assessment.",
        breech:
          "Buttocks/feet-presenting; subtype and management require clinical assessment.",
        shoulder:
          "Shoulder presentation can relate to transverse lie; clinical assessment is required.",
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
  input: { topic: "cephalic" },
  output: {
    result: {
      text: "Head-presenting; subtypes require actual clinical assessment.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pregnancy/fetal-presentation-lookup",
  title: "Fetal Presentation Lookup",
  description:
    "Bounded offline reference: Presentation names the independently clinically identified fetal part approaching the birth canal. Source: Obstetric anatomical terminology. No automatic examination, delivery recommendation or safe-management conclusion. Explicit topic keys: cephalic, breech, shoulder. Not a full/current corpus, diagnosis, treatment recommendation or safety certification.",
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
