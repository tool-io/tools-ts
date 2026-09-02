import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  integer,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedCostLineMinorUnits: readonly number[];
  readonly callerAlreadyAccountedCreditsMinorUnits: readonly number[];
  readonly marketableProductionGrams: number;
}>;
export type Output = Readonly<{
  readonly netProductionCostMinorUnits: number;
  readonly roundedProductionCostMinorUnitsPerKg: number;
}>;
const inputFields = [
  {
    id: "observedCostLineMinorUnits",
    label: "Observed cost line minor units",
    kind: "numberList",
  },
  {
    id: "callerAlreadyAccountedCreditsMinorUnits",
    label: "Caller already accounted credits minor units",
    kind: "numberList",
  },
  {
    id: "marketableProductionGrams",
    label: "Marketable production grams",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedCostLineMinorUnits.forEach((v) => {
    integer(v, "cost");
    nonnegative(v, "cost");
  });
  input.callerAlreadyAccountedCreditsMinorUnits.forEach((v) => {
    integer(v, "credit");
    nonnegative(v, "credit");
  });
  positive(input.marketableProductionGrams, "production");
  integer(input.marketableProductionGrams, "grams");
  const cost =
    input.observedCostLineMinorUnits.reduce((s, v) => s + BigInt(v), 0n) -
    input.callerAlreadyAccountedCreditsMinorUnits.reduce(
      (s, v) => s + BigInt(v),
      0n,
    );
  const total = integer(Number(cost), "net cost"),
    sign = cost < 0n ? -1n : 1n,
    n = cost * sign * 1000n,
    d = BigInt(input.marketableProductionGrams);
  return {
    netProductionCostMinorUnits: total,
    roundedProductionCostMinorUnitsPerKg: integer(
      Number(sign * ((2n * n + d) / (2n * d))),
      "unit cost",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCostLineMinorUnits: [10, 20],
  callerAlreadyAccountedCreditsMinorUnits: [2, 3],
  marketableProductionGrams: 2000,
} satisfies Input;
export const exampleOutput = {
  netProductionCostMinorUnits: 25,
  roundedProductionCostMinorUnitsPerKg: 13,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/cost-of-production-per-kg",
  title: "Agriculture Cost Of Production Per Kg Calculator",
  description:
    "Exact single caller currency integer minor-unit cost/credit inventory per whole grams, nearest-unit cost per kg with ties away from zero, signed net credits retained. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "netProductionCostMinorUnits",
      label: "Net production cost minor units",
      kind: "number",
    },
    {
      id: "roundedProductionCostMinorUnitsPerKg",
      label: "Rounded production cost minor units per kg",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedCostLineMinorUnits:
        value.observedCostLineMinorUnits as readonly number[],
      callerAlreadyAccountedCreditsMinorUnits:
        value.callerAlreadyAccountedCreditsMinorUnits as readonly number[],
      marketableProductionGrams: value.marketableProductionGrams as number,
    }),
});
export const run = tool.execute;
export default tool;
