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
          "Waqf denotes an endowment with charitable/religious purposes under specific legal and jurisprudential traditions.",
        reference: "Islamic endowment scholarship.",
        limitations:
          "Perpetuity, administration and permitted variations differ; not a legal or religious ruling.",
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
      text: "Waqf denotes an endowment with charitable/religious purposes under specific legal and jurisprudential traditions.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/waqf-endowment-perpetual-charitable-principle-lookup",
  title: "Waqf Endowment Perpetual Charitable Principle Lookup",
  description:
    "Bounded offline reference: Waqf denotes an endowment with charitable/religious purposes under specific legal and jurisprudential traditions. Source: Islamic endowment scholarship. Perpetuity, administration and permitted variations differ; not a legal or religious ruling. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
