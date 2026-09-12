import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  money,
  roundMinor,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualMedicationCostMinorUnits: number;
  readonly actualCoveredDays: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualMedicationCostMinorUnits",
    label: "Actual medication cost minor units",
    kind: "number",
  },
  { id: "actualCoveredDays", label: "Actual covered days", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  money(input.actualMedicationCostMinorUnits, "cost");
  bounded(input.actualCoveredDays, "days", 1, 1000000);
  let a = BigInt(input.actualMedicationCostMinorUnits),
    b = BigInt(input.actualCoveredDays),
    x = a,
    y = b;
  while (y) {
    const z = x % y;
    x = y;
    y = z;
  }
  a /= x;
  b /= x;
  return {
    exactCostRateNumeratorMinorUnits: a.toString(),
    exactCostRateDenominatorDays: b.toString(),
    roundedCostPerDayMinorUnits: roundMinor(a, b),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualMedicationCostMinorUnits: 100, actualCoveredDays: 3 },
  output: {
    result: {
      exactCostRateNumeratorMinorUnits: "100",
      exactCostRateDenominatorDays: "3",
      roundedCostPerDayMinorUnits: 33,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pharmacy/medication-cost-per-day-generic",
  title: "Generic Cost Per Day Calculator",
  description:
    "Actual medication cost one currency safe integer minor units/covered whole days, reducedBigIntrational and half away rounded rate. No live generic price, insurance benefit or dosing policy.",
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
