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
          "Spilled-sugar and tea-accident interpretations require documented local versions; everyday causes remain separate.",
        reference: "Comparative household superstition collections.",
        limitations:
          "No universal canonical saying, causal luck or safe food-handling conclusion.",
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
      text: "Spilled-sugar and tea-accident interpretations require documented local versions; everyday causes remain separate.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/spilled-sugar-stir-the-tea-accident-logic-lookup",
  title: "Spilled Sugar Stir the Tea Accident Logic Lookup",
  description:
    "Bounded offline reference: Spilled-sugar and tea-accident interpretations require documented local versions; everyday causes remain separate. Source: Comparative household superstition collections. No universal canonical saying, causal luck or safe food-handling conclusion. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
