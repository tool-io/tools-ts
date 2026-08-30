import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { nonnegative, fraction, count } from "../shared.js";

export type Input = Readonly<{
  readonly initialOrganicVisits: number;
  readonly monthlyOrganicGrowth: number;
  readonly paidMonthlyVisits: number;
  readonly paidStopMonth: number;
  readonly months: number;
}>;
export type Output = Readonly<{
  readonly organicVisits: readonly number[];
  readonly paidVisits: readonly number[];
  readonly totalVisits: readonly number[];
}>;
export const calculate = (input: Input): Output => {
  nonnegative(input.initialOrganicVisits, "initialOrganicVisits");
  nonnegative(input.paidMonthlyVisits, "paidMonthlyVisits");
  fraction(input.monthlyOrganicGrowth, "monthlyOrganicGrowth");
  count(input.paidStopMonth, "paidStopMonth");
  count(input.months, "months", 1);
  if (input.months > 1200)
    simpleError("months", "Projection is limited to 1200 months.");
  const organicVisits = Array.from(
      { length: input.months },
      (_, i) =>
        input.initialOrganicVisits * (1 + input.monthlyOrganicGrowth) ** i,
    ),
    paidVisits = organicVisits.map((_, i) =>
      i < input.paidStopMonth ? input.paidMonthlyVisits : 0,
    );
  return {
    organicVisits,
    paidVisits,
    totalVisits: organicVisits.map((v, i) => v + paidVisits[i]),
  };
};
export const exampleInput = {
  initialOrganicVisits: 100,
  monthlyOrganicGrowth: 0.1,
  paidMonthlyVisits: 200,
  paidStopMonth: 2,
  months: 3,
} satisfies Input;
export const exampleOutput = {
  organicVisits: [100, 110, 121],
  paidVisits: [200, 200, 0],
  totalVisits: [300, 310, 121],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/organic-paid-traffic-projection",
  title: "Organic Paid Traffic Projection",
  description:
    "Compare an assumed compounding organic traffic stream with paid traffic ending at a chosen month.",
  inputs: [
    {
      id: "initialOrganicVisits",
      label: "Initial organic visits",
      kind: "number",
    },
    {
      id: "monthlyOrganicGrowth",
      label: "Monthly organic growth",
      kind: "number",
    },
    { id: "paidMonthlyVisits", label: "Paid monthly visits", kind: "number" },
    { id: "paidStopMonth", label: "Paid stop month", kind: "integer" },
    { id: "months", label: "Months", kind: "integer" },
  ],
  outputs: [
    { id: "organicVisits", label: "Organic visits", kind: "numberList" },
    { id: "paidVisits", label: "Paid visits", kind: "numberList" },
    { id: "totalVisits", label: "Total visits", kind: "numberList" },
  ],
  calculate: (value) =>
    calculate({
      initialOrganicVisits: value.initialOrganicVisits as number,
      monthlyOrganicGrowth: value.monthlyOrganicGrowth as number,
      paidMonthlyVisits: value.paidMonthlyVisits as number,
      paidStopMonth: value.paidStopMonth as number,
      months: value.months as number,
    }),
});
export const run = tool.execute;
export default tool;
