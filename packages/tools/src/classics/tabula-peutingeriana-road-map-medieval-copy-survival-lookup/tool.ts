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
          "The Tabula Peutingeriana survives through a medieval manuscript copy reflecting older Roman road/geographic traditions.",
        reference:
          "\u00d6sterreichische Nationalbibliothek, Codex324; map scholarship.",
        limitations:
          "Its elongated schematic layout is not modern geographic scale or a single exact snapshot of every Roman road.",
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
      text: "The Tabula Peutingeriana survives through a medieval manuscript copy reflecting older Roman road/geographic traditions.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/tabula-peutingeriana-road-map-medieval-copy-survival-lookup",
  title: "Tabula Peutingeriana Road Map Medieval Copy Survival Lookup",
  description:
    "Bounded offline reference: The Tabula Peutingeriana survives through a medieval manuscript copy reflecting older Roman road/geographic traditions. Source: \u00d6sterreichische Nationalbibliothek, Codex324; map scholarship. Its elongated schematic layout is not modern geographic scale or a single exact snapshot of every Roman road. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
