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
          "Carbon-plated racing footwear combines geometry, foam and plates; performance effects are not attributable to the plate alone.",
        reference: "Advanced footwear performance research.",
        limitations:
          "Individual effects, rules and injuries vary; not a guaranteed time improvement or shoe prescription.",
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
      text: "Carbon-plated racing footwear combines geometry, foam and plates; performance effects are not attributable to the plate alone.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/carbon-plate-shoe-performance-era-note-lookup",
  title: "Carbon Plate Shoe Performance Era Note Lookup",
  description:
    "Bounded offline reference: Carbon-plated racing footwear combines geometry, foam and plates; performance effects are not attributable to the plate alone. Source: Advanced footwear performance research. Individual effects, rules and injuries vary; not a guaranteed time improvement or shoe prescription. Explicit topic keys: summary, reference, limitations. Not a full/current corpus, diagnosis, treatment recommendation or safety certification.",
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
