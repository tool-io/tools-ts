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
          "Hadrians Villa at Tivoli incorporates varied architectural references associated with an imperial complex and travel-inspired interpretations.",
        reference: "Hadrians Villa archaeological scholarship.",
        limitations:
          "Ancient building names and exact inspirations can be debated; not a literal faithful replica of every province.",
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
      text: "Hadrians Villa at Tivoli incorporates varied architectural references associated with an imperial complex and travel-inspired interpretations.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/hadrians-villa-tivoli-recreated-provinces-travels-lookup",
  title: "Hadrians Villa Tivoli Recreated Provinces Travels Lookup",
  description:
    "Bounded offline reference: Hadrians Villa at Tivoli incorporates varied architectural references associated with an imperial complex and travel-inspired interpretations. Source: Hadrians Villa archaeological scholarship. Ancient building names and exact inspirations can be debated; not a literal faithful replica of every province. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
