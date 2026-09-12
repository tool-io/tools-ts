import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch49-shared.js";
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
        historicalFormula:
          "Clark historical fraction: weight pounds/150\u00d7adult dose. Historical arithmetic is not a current validated pediatric prescription.",
        clinicalLimitation:
          "Do not infer pediatric/infant dose from a nominal adult dose and age/weight alone. Actual drug, development, indication, renal function and current qualified pediatric protocol determine prescribing.",
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
  input: { topic: "historicalFormula" },
  output: {
    result: {
      text: "Clark historical fraction: weight pounds/150\u00d7adult dose. Historical arithmetic is not a current validated pediatric prescription.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pharmacy/pediatric-clark-rule",
  title: "Clark's Rule Pediatric Dose Calculator",
  description:
    "Bounded off line reference: HistoricalClarkrule reference only; obsolete simplistic extrapolation is not automated clinical dosing. Explicit topics historical formula, clinical limitation. No full/live authority, clinical diagnosis, safe-use approval or universal individual outcome.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
