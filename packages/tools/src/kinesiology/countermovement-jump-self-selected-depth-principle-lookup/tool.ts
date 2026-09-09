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
          "Countermovement-jump self-selected depth reflects a task strategy; forcing a fixed depth changes the tested movement.",
        reference: "Countermovement-jump depth research.",
        limitations:
          "No universal optimal depth or proof a deeper countermovement is safe/effective for an individual.",
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
      text: "Countermovement-jump self-selected depth reflects a task strategy; forcing a fixed depth changes the tested movement.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/countermovement-jump-self-selected-depth-principle-lookup",
  title: "Countermovement Jump Self Selected Depth Principle Lookup",
  description:
    "Bounded offline reference: Countermovement-jump self-selected depth reflects a task strategy; forcing a fixed depth changes the tested movement. Source: Countermovement-jump depth research. No universal optimal depth or proof a deeper countermovement is safe/effective for an individual. Explicit topic keys: summary, reference, limitations. Not a full/current corpus, diagnosis, treatment recommendation or safety certification.",
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
