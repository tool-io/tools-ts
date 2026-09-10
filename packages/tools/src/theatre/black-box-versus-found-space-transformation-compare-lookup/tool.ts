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
          "Black-box spaces offer flexible configurations; found-space productions adapt sites not purpose-built as theatres.",
        reference:
          "Theatre architecture and site-specific performance scholarship.",
        limitations:
          "Flexibility does not remove structural, accessibility, fire or heritage constraints.",
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
      text: "Black-box spaces offer flexible configurations; found-space productions adapt sites not purpose-built as theatres.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/black-box-versus-found-space-transformation-compare-lookup",
  title: "Black Box Versus Found Space Transformation Compare Lookup",
  description:
    "Bounded offline reference: Black-box spaces offer flexible configurations; found-space productions adapt sites not purpose-built as theatres. Source: Theatre architecture and site-specific performance scholarship. Flexibility does not remove structural, accessibility, fire or heritage constraints. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
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
