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
          "FX forwards fix specified future exchange terms; option collars combine option positions with strike-dependent exposures.",
        reference: "CFTC and central-bank FX risk disclosures.",
        limitations:
          "No guaranteed hedge, price quote, suitability or risk-free strategy; collateral, premiums and basis risk remain.",
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
      text: "FX forwards fix specified future exchange terms; option collars combine option positions with strike-dependent exposures.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/fx-hedging-forward-collar-options-strategies-overview-lookup",
  title: "Fx Hedging Forward Collar Options Strategies Overview Lookup",
  description:
    "Bounded offline reference: FX forwards fix specified future exchange terms; option collars combine option positions with strike-dependent exposures. Source: CFTC and central-bank FX risk disclosures. No guaranteed hedge, price quote, suitability or risk-free strategy; collateral, premiums and basis risk remain. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
