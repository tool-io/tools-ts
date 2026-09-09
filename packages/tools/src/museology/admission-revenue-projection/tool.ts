import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
  aligned,
  money,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly callerProjectedTicketCounts: readonly number[];
  readonly callerVerifiedNetTicketPricesMinor: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerProjectedTicketCounts",
    label: "Caller projected ticket counts",
    kind: "numberList",
  },
  {
    id: "callerVerifiedNetTicketPricesMinor",
    label: "Caller verified net ticket prices minor",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.callerProjectedTicketCounts,
    input.callerVerifiedNetTicketPricesMinor,
    "ticketclasses",
  );
  input.callerProjectedTicketCounts.forEach((v) =>
    bounded(v, "tickets", 0, 1000000000),
  );
  input.callerVerifiedNetTicketPricesMinor.forEach((v) => money(v, "price"));
  const t = input.callerProjectedTicketCounts.reduce(
    (a, v, i) =>
      a + BigInt(v) * BigInt(input.callerVerifiedNetTicketPricesMinor[i]),
    0n,
  );
  if (t > BigInt(Number.MAX_SAFE_INTEGER))
    simpleError("revenue", "Safe exact minor-unit total.");
  return { conditionalProjectedAdmissionRevenueMinor: Number(t) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerProjectedTicketCounts: [10, 20],
    callerVerifiedNetTicketPricesMinor: [100, 50],
  },
  output: { result: { conditionalProjectedAdmissionRevenueMinor: 2000 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/admission-revenue-projection",
  title: "Admission Revenue Projection Visitors x Price Calculator",
  description:
    "Conditional admission revenue scenario from independently declared disjoint ticket classes and actual net prices. Exact single-currency minor units; projections are not demand forecasts, all visitor admissions or cash recognized.",
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
