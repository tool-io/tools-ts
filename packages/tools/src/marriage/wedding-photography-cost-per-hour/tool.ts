import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  money,
  roundMinor,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualPhotographyCostMinorUnits: number;
  readonly actualCoveredMinutes: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualPhotographyCostMinorUnits",
    label: "Actual photography cost minor units",
    kind: "number",
  },
  {
    id: "actualCoveredMinutes",
    label: "Actual covered minutes",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  money(input.actualPhotographyCostMinorUnits, "cost");
  bounded(
    input.actualCoveredMinutes,
    "denominator",
    1,
    Number.MAX_SAFE_INTEGER,
  );
  let a = BigInt(input.actualPhotographyCostMinorUnits) * 60n,
    b = BigInt(input.actualCoveredMinutes);
  let x = a,
    y = b;
  while (y) {
    const z = x % y;
    x = y;
    y = z;
  }
  a /= x;
  b /= x;
  return {
    exactRateNumeratorMinorUnits: a.toString(),
    exactRateDenominator: b.toString(),
    roundedRateMinorUnits: roundMinor(a, b),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualPhotographyCostMinorUnits: 100, actualCoveredMinutes: 180 },
  output: {
    result: {
      exactRateNumeratorMinorUnits: "100",
      exactRateDenominator: "3",
      roundedRateMinorUnits: 33,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "marriage/wedding-photography-cost-per-hour",
  title: "Wedding Photography Cost Per Hour Calculator",
  description:
    "actual photography contract cost/covered time. Safeinteger nonnegative same-currency minor-units, integer denominator; reduce exact BigInt rational and half-away-from-zero rounded minor-unit rate. Ring total includes actual setting/service costs, not inferred gemstone market price. No quote, price appraisal, tax or live conversion.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
