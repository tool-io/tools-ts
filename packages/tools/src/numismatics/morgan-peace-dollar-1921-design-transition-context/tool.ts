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
          "1921 includes both Morgan and Peace silver-dollar production; Peace introduced a new design near year end.",
        reference: "US Mint, Morgan/Peace dollar histories.",
        limitations:
          "Year alone does not distinguish design, mint, relief or authenticity.",
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
      text: "1921 includes both Morgan and Peace silver-dollar production; Peace introduced a new design near year end.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/morgan-peace-dollar-1921-design-transition-context",
  title: "Morgan Peace Dollar 1921 Design Transition Context",
  description:
    "Bounded offline reference: 1921 includes both Morgan and Peace silver-dollar production; Peace introduced a new design near year end. Source: US Mint, Morgan/Peace dollar histories. Year alone does not distinguish design, mint, relief or authenticity. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
