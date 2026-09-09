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
          "Borellis De Motu Animaliumapplied mechanical analysis to animal movement and is a foundational work in biomechanics.",
        reference: "Borelli, De Motu Animalium1680/1681.",
        limitations:
          "Father-of-biomechanics is a historical shorthand, not proof no earlier contributors existed.",
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
      text: "Borellis De Motu Animaliumapplied mechanical analysis to animal movement and is a foundational work in biomechanics.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/borelli-de-motu-animalium-biomechanics-father-history",
  title: "Borelli De Motu Animalium Biomechanics Father History",
  description:
    "Bounded offline reference: Borellis De Motu Animaliumapplied mechanical analysis to animal movement and is a foundational work in biomechanics. Source: Borelli, De Motu Animalium1680/1681. Father-of-biomechanics is a historical shorthand, not proof no earlier contributors existed. Explicit topic keys: summary, reference, limitations. Not a full/current corpus, diagnosis, treatment recommendation or safety certification.",
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
