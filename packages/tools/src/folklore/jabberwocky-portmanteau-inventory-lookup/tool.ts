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
        slithy: "Lithe and slimy in Humpty Dumptys explanation.",
        mimsy: "Flimsy and miserable in Humpty Dumptys explanation.",
        borogoves:
          "Fictional birds in the explanation, not a transparent two-word portmanteau.",
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
  input: { topic: "slithy" },
  output: {
    result: { text: "Lithe and slimy in Humpty Dumptys explanation." },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/jabberwocky-portmanteau-inventory-lookup",
  title: "Jabberwocky Portmanteau Inventory Lookup",
  description:
    "Bounded offline reference: Humpty Dumpty explains selected portmanteau words in Through the Looking-Glass. Source: Lewis Carroll, Through the Looking-Glass, chapter 6. Fictional lexical explanation, not scientific etymology or every Jabberwocky word. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
