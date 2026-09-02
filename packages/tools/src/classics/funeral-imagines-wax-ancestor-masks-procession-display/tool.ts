import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch45-shared.js";
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
          "Elite Roman funeral display could include ancestral imagines and processions connected to family status and public memory.",
        reference: "Polybius 6.53\u201354; Roman funerary scholarship.",
        limitations:
          "Materials, presence and privilege vary; not every Roman used identical wax masks or verified genealogies.",
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
      text: "Elite Roman funeral display could include ancestral imagines and processions connected to family status and public memory.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/funeral-imagines-wax-ancestor-masks-procession-display",
  title: "Funeral Imagines Wax Ancestor Masks Procession Display",
  description:
    "Bounded offline reference: Elite Roman funeral display could include ancestral imagines and processions connected to family status and public memory. Source: Polybius 6.53\u201354; Roman funerary scholarship. Materials, presence and privilege vary; not every Roman used identical wax masks or verified genealogies. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
