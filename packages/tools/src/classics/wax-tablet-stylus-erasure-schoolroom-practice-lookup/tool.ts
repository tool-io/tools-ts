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
          "Wax tablets provided reusable writing surfaces, and a stylus could have a writing point and a flattening/erasing end.",
        reference: "Roman writing-material archaeology.",
        limitations:
          "Not every tablet used wax or every mark is schoolwork; no conservation/handling approval.",
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
      text: "Wax tablets provided reusable writing surfaces, and a stylus could have a writing point and a flattening/erasing end.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/wax-tablet-stylus-erasure-schoolroom-practice-lookup",
  title: "Wax Tablet Stylus Erasure Schoolroom Practice Lookup",
  description:
    "Bounded offline reference: Wax tablets provided reusable writing surfaces, and a stylus could have a writing point and a flattening/erasing end. Source: Roman writing-material archaeology. Not every tablet used wax or every mark is schoolwork; no conservation/handling approval. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
