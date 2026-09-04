import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch44-shared.js";

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
          "Baba Yaga narratives frequently feature a hut on chicken legs and travel in a mortar with a pestle, but roles and details vary.",
        reference: "Afanasyev, Russian folktale collections; Johns, Baba Yaga.",
        limitations:
          "Motifs are not universal to every version or instructions for rituals.",
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
      text: "Baba Yaga narratives frequently feature a hut on chicken legs and travel in a mortar with a pestle, but roles and details vary.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/baba-yaga-chicken-legged-hut-mortar-flight-iconography-lookup",
  title: "Baba Yaga Chicken Legged Hut Mortar Flight Iconography Lookup",
  description:
    "Bounded offline reference: Baba Yaga narratives frequently feature a hut on chicken legs and travel in a mortar with a pestle, but roles and details vary. Source: Afanasyev, Russian folktale collections; Johns, Baba Yaga. Motifs are not universal to every version or instructions for rituals. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
