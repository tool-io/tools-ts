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
          "Balance-sheet runoff can limit reinvestment through stated caps and differs from outright asset sales.",
        reference: "Federal Reserve, balance-sheet normalization plans.",
        limitations:
          "No current cap amount or pace fabricated; holdings, maturities and policy amendments matter.",
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
      text: "Balance-sheet runoff can limit reinvestment through stated caps and differs from outright asset sales.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/quantitative-tightening-balance-sheet-runoff-cap-notes-lookup",
  title: "Quantitative Tightening Balance Sheet Runoff Cap Notes Lookup",
  description:
    "Bounded offline reference: Balance-sheet runoff can limit reinvestment through stated caps and differs from outright asset sales. Source: Federal Reserve, balance-sheet normalization plans. No current cap amount or pace fabricated; holdings, maturities and policy amendments matter. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
