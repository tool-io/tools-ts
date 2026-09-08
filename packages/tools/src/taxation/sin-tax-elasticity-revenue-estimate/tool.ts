import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  integer,
  finite,
  money,
  roundMinor,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedBaselineQuantityUnits: number;
  readonly observedBaselineTotalPriceMinor: number;
  readonly callerProposedTotalPriceMinor: number;
  readonly callerPriceElasticity: number;
  readonly callerProposedUnitExciseMinor: number;
}>;
export type Output = Readonly<{
  readonly conditionalQuantityUnits: number;
  readonly conditionalExciseRevenueMinor: number;
}>;
const inputFields = [
  {
    id: "observedBaselineQuantityUnits",
    label: "Observed baseline quantity units",
    kind: "number",
  },
  {
    id: "observedBaselineTotalPriceMinor",
    label: "Observed baseline total price minor",
    kind: "number",
  },
  {
    id: "callerProposedTotalPriceMinor",
    label: "Caller proposed total price minor",
    kind: "number",
  },
  {
    id: "callerPriceElasticity",
    label: "Caller price elasticity",
    kind: "number",
  },
  {
    id: "callerProposedUnitExciseMinor",
    label: "Caller proposed unit excise minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(
    input.observedBaselineTotalPriceMinor,
    "observedBaselineTotalPriceMinor",
  );
  money(input.callerProposedTotalPriceMinor, "callerProposedTotalPriceMinor");
  money(input.callerProposedUnitExciseMinor, "callerProposedUnitExciseMinor");
  nonnegative(
    input.observedBaselineQuantityUnits,
    "observedBaselineQuantityUnits",
  );
  positive(input.observedBaselineTotalPriceMinor, "baselineprice");
  positive(input.callerProposedTotalPriceMinor, "proposedprice");
  if (input.callerPriceElasticity > 0 || input.callerPriceElasticity < -10)
    simpleError("elasticity", "Explicit−10..0constant demand elasticity.");
  const q =
    input.observedBaselineQuantityUnits *
    (input.callerProposedTotalPriceMinor /
      input.observedBaselineTotalPriceMinor) **
      input.callerPriceElasticity;
  const thousandths = integer(
    Math.round(finite(q * 1000)),
    "quantity thousandths",
  );
  return {
    conditionalQuantityUnits: thousandths / 1000,
    conditionalExciseRevenueMinor: roundMinor(
      BigInt(thousandths) * BigInt(input.callerProposedUnitExciseMinor),
      1000n,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedBaselineQuantityUnits: 100,
  observedBaselineTotalPriceMinor: 100,
  callerProposedTotalPriceMinor: 200,
  callerPriceElasticity: -1,
  callerProposedUnitExciseMinor: 20,
} satisfies Input;
export const exampleOutput = {
  conditionalQuantityUnits: 50,
  conditionalExciseRevenueMinor: 1000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/sin-tax-elasticity-revenue-estimate",
  title: "Sin Tax Elasticity Revenue Estimate Calculator",
  description:
    "Conditional constant-elasticity sin-tax demand scenario, independently proposed total price includes pass-through; quantity nearest.001 unit then exact minor revenue, no causal demand/revenue prediction. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "conditionalQuantityUnits",
      label: "Conditional quantity units",
      kind: "number",
    },
    {
      id: "conditionalExciseRevenueMinor",
      label: "Conditional excise revenue minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedBaselineQuantityUnits:
        value.observedBaselineQuantityUnits as number,
      observedBaselineTotalPriceMinor:
        value.observedBaselineTotalPriceMinor as number,
      callerProposedTotalPriceMinor:
        value.callerProposedTotalPriceMinor as number,
      callerPriceElasticity: value.callerPriceElasticity as number,
      callerProposedUnitExciseMinor:
        value.callerProposedUnitExciseMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
