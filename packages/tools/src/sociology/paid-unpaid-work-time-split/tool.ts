import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly observedPaidMinutes: readonly number[];
  readonly observedUnpaidMinutes: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "observedPaidMinutes",
    label: "Observed paid minutes",
    kind: "numberList",
  },
  {
    id: "observedUnpaidMinutes",
    label: "Observed unpaid minutes",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(input.observedPaidMinutes, input.observedUnpaidMinutes, "diary");
  [input.observedPaidMinutes, input.observedUnpaidMinutes].forEach((v) =>
    v.forEach((x) => nonnegative(x, "minutes")),
  );
  const p = sum(input.observedPaidMinutes),
    u = sum(input.observedUnpaidMinutes),
    t = positive(p + u, "observedtime");
  return { observedPaidFraction: p / t, observedUnpaidFraction: u / t };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { observedPaidMinutes: [60, 120], observedUnpaidMinutes: [120, 60] },
  output: {
    result: { observedPaidFraction: 0.5, observedUnpaidFraction: 0.5 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/paid-unpaid-work-time-split",
  title: "Paid vs Unpaid Work Time Split Calculator",
  description:
    "Actual disjoint paid/unpaid time-use diary split with matched observation coverage; simultaneous activities must be independently allocated, not gender roles or monetary value inferred.",
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
