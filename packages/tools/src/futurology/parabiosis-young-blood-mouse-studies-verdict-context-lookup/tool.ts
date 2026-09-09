import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch46-shared.js";
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
          "Heterochronic parabiosis studies connect circulations of different-age animals and cannot isolate every effect to young blood alone.",
        reference: "Animalparabiosis/ageing literature.",
        limitations:
          "Mouse findings do not establish safe/effective human young-blood treatment; no procedure instructions.",
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
      text: "Heterochronic parabiosis studies connect circulations of different-age animals and cannot isolate every effect to young blood alone.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "futurology/parabiosis-young-blood-mouse-studies-verdict-context-lookup",
  title: "Parabiosis Young Blood Mouse Studies Verdict Context Lookup",
  description:
    "Bounded offline reference: Heterochronic parabiosis studies connect circulations of different-age animals and cannot isolate every effect to young blood alone. Source: Animalparabiosis/ageing literature. Mouse findings do not establish safe/effective human young-blood treatment; no procedure instructions. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
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
