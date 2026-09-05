import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch43-shared.js";

export type Input = Readonly<{ readonly topic: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "topic", label: "Topic", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        summary:
          "English roundel terms commonly include or:bezant; argent:plate; gules:torteau; azure:hurt; sable:pellet; vert:pomme; purpure:golpe.",
        reference:
          "A C Fox-Davies, A Complete Guide to Heraldry, roundels chapter.",
        limitations:
          "Usage, plural spelling, mixed tinctures and regional conventions vary; not a grant identification.",
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
      text: "English roundel terms commonly include or:bezant; argent:plate; gules:torteau; azure:hurt; sable:pellet; vert:pomme; purpure:golpe.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "heraldry/roundel-name-mapper",
  title: "Roundel Tincture Name Mapper (bezant/plate/hurt etc.)",
  description:
    "Offline bounded reference card: English roundel terms commonly include or:bezant; argent:plate; gules:torteau; azure:hurt; sable:pellet; vert:pomme; purpure:golpe. References A C Fox-Davies, A Complete Guide to Heraldry, roundels chapter. Usage, plural spelling, mixed tinctures and regional conventions vary; not a grant identification.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
