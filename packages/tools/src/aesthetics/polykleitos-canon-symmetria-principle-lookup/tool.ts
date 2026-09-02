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
          "Polykleitos Canon is associated with symmetria, commensurable relations among parts; the treatise does not survive intact.",
        reference:
          "Galen, On the Doctrines of Hippocrates and Plato5; classical sculpture scholarship.",
        limitations:
          "No fabricated complete original measurements or scientifically universal ideal body.",
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
      text: "Polykleitos Canon is associated with symmetria, commensurable relations among parts; the treatise does not survive intact.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/polykleitos-canon-symmetria-principle-lookup",
  title: "Polykleitos Canon Symmetria Principle Lookup",
  description:
    "Bounded offline reference: Polykleitos Canon is associated with symmetria, commensurable relations among parts; the treatise does not survive intact. Source: Galen, On the Doctrines of Hippocrates and Plato5; classical sculpture scholarship. No fabricated complete original measurements or scientifically universal ideal body. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
