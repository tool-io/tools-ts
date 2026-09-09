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
  readonly actualEngagementRingCostMinorUnits: number;
  readonly actualStoneWeightMicrocarats: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualEngagementRingCostMinorUnits",
    label: "Actual engagement ring cost minor units",
    kind: "number",
  },
  {
    id: "actualStoneWeightMicrocarats",
    label: "Actual stone weight microcarats",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  money(input.actualEngagementRingCostMinorUnits, "cost");
  bounded(
    input.actualStoneWeightMicrocarats,
    "denominator",
    1,
    Number.MAX_SAFE_INTEGER,
  );
  let a = BigInt(input.actualEngagementRingCostMinorUnits) * 1000000n,
    b = BigInt(input.actualStoneWeightMicrocarats);
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
  input: {
    actualEngagementRingCostMinorUnits: 100,
    actualStoneWeightMicrocarats: 3000000,
  },
  output: {
    result: {
      exactRateNumeratorMinorUnits: "100",
      exactRateDenominator: "3",
      roundedRateMinorUnits: 33,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "marriage/engagement-ring-carat-price",
  title: "Engagement Ring Carat Price Calculator",
  description:
    "actual engagement ring total/verified stone carats. Safeinteger nonnegative same-currency minor-units, integer denominator; reduce exact BigInt rational and half-away-from-zero rounded minor-unit rate. Ring total includes actual setting/service costs, not inferred gemstone market price. No quote, price appraisal, tax or live conversion.",
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
