import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  integer,
  fraction,
  bounded,
  aligned,
  weightedMinor,
  strictlyIncreasing,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly observedSeatDemandFraction: number;
  readonly callerTierLowerBoundsFractions: readonly number[];
  readonly baseTicketPriceMinor: number;
  readonly callerTierPriceMultiplierBasisPoints: readonly number[];
}>;
export type Output = Readonly<{
  readonly appliedCallerDemandTierIndex: number;
  readonly roundedTierTicketPriceMinor: number;
}>;
const inputFields = [
  {
    id: "observedSeatDemandFraction",
    label: "Observed seat demand fraction",
    kind: "number",
  },
  {
    id: "callerTierLowerBoundsFractions",
    label: "Caller tier lower bounds fractions",
    kind: "numberList",
  },
  {
    id: "baseTicketPriceMinor",
    label: "Base ticket price minor",
    kind: "number",
  },
  {
    id: "callerTierPriceMultiplierBasisPoints",
    label: "Caller tier price multiplier basis points",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  fraction(input.observedSeatDemandFraction, "observedSeatDemandFraction");
  input.callerTierLowerBoundsFractions.forEach((v) =>
    fraction(v, "callerTierLowerBoundsFractions"),
  );
  aligned(
    input.callerTierLowerBoundsFractions,
    input.callerTierPriceMultiplierBasisPoints,
    "callerTierLowerBoundsFractions",
  );
  strictlyIncreasing(input.callerTierLowerBoundsFractions, "tiers", 1);
  if (input.callerTierLowerBoundsFractions[0] !== 0)
    simpleError("tiers", "Caller demand tiers must cover zero demand.");
  bounded(input.baseTicketPriceMinor, "price", 0, 1000000000);
  input.callerTierPriceMultiplierBasisPoints.forEach((v) => {
    bounded(v, "multiplier", 1, 1000000);
  });
  const index = input.callerTierLowerBoundsFractions.reduce(
      (best, v, i) => (input.observedSeatDemandFraction >= v ? i : best),
      -1,
    ),
    price = weightedMinor(
      input.baseTicketPriceMinor,
      input.callerTierPriceMultiplierBasisPoints[index],
      10000,
    );
  return {
    appliedCallerDemandTierIndex: index,
    roundedTierTicketPriceMinor: integer(price, "price"),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSeatDemandFraction: 0.75,
  callerTierLowerBoundsFractions: [0, 0.5, 0.8],
  baseTicketPriceMinor: 1000,
  callerTierPriceMultiplierBasisPoints: [10000, 12000, 15000],
} satisfies Input;
export const exampleOutput = {
  appliedCallerDemandTierIndex: 1,
  roundedTierTicketPriceMinor: 1200,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/dynamic-pricing-demand-tier-multiplier-lookup",
  title: "Dynamic Pricing Demand Tier Multiplier Lookup",
  description:
    "Apply explicit caller observed-demand pricing tiers; lower bound inclusive and exact rational half-up rounded minor-unit price, no universal yield algorithm, legal fairness approval or demand forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "appliedCallerDemandTierIndex",
      label: "Applied caller demand tier index",
      kind: "number",
    },
    {
      id: "roundedTierTicketPriceMinor",
      label: "Rounded tier ticket price minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSeatDemandFraction: value.observedSeatDemandFraction as number,
      callerTierLowerBoundsFractions:
        value.callerTierLowerBoundsFractions as readonly number[],
      baseTicketPriceMinor: value.baseTicketPriceMinor as number,
      callerTierPriceMultiplierBasisPoints:
        value.callerTierPriceMultiplierBasisPoints as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
