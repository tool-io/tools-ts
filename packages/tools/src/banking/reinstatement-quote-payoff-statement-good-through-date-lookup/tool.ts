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
          "Reinstatement addresses arrears to restore a loan; payoff addresses the amount needed to extinguish the obligation under specified terms.",
        reference: "CFPB, mortgage payoff/servicing guidance.",
        limitations:
          "Good-through dates, per-diem interest, fees and payment method must be independently verified; neither quote authorizes an assumed transfer.",
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
      text: "Reinstatement addresses arrears to restore a loan; payoff addresses the amount needed to extinguish the obligation under specified terms.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/reinstatement-quote-payoff-statement-good-through-date-lookup",
  title: "Reinstatement Quote Payoff Statement Good Through Date Lookup",
  description:
    "Bounded offline reference: Reinstatement addresses arrears to restore a loan; payoff addresses the amount needed to extinguish the obligation under specified terms. Source: CFPB, mortgage payoff/servicing guidance. Good-through dates, per-diem interest, fees and payment method must be independently verified; neither quote authorizes an assumed transfer. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
