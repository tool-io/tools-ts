import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly monthlyTransitBenefit: number;
  readonly monthlyParkingBenefit: number;
  readonly transitExclusionCap: number;
  readonly parkingExclusionCap: number;
}>;
export type Output = Readonly<{
  readonly excludedTransit: number;
  readonly excludedParking: number;
  readonly taxableExcess: number;
}>;

export const calculate = (input: Input): Output => {
  const excludedTransit = Math.min(
    input.monthlyTransitBenefit,
    input.transitExclusionCap,
  );
  const excludedParking = Math.min(
    input.monthlyParkingBenefit,
    input.parkingExclusionCap,
  );
  return {
    excludedTransit,
    excludedParking,
    taxableExcess:
      input.monthlyTransitBenefit -
      excludedTransit +
      input.monthlyParkingBenefit -
      excludedParking,
  };
};

export const exampleInput = {
  monthlyTransitBenefit: 400,
  monthlyParkingBenefit: 300,
  transitExclusionCap: 300,
  parkingExclusionCap: 300,
} satisfies Input;
export const exampleOutput = {
  excludedTransit: 300,
  excludedParking: 300,
  taxableExcess: 100,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      monthlyTransitBenefit: input.monthlyTransitBenefit as number,
      monthlyParkingBenefit: input.monthlyParkingBenefit as number,
      transitExclusionCap: input.transitExclusionCap as number,
      parkingExclusionCap: input.parkingExclusionCap as number,
    }),
  description:
    "Apply caller-supplied transit and parking exclusion caps separately.",
  id: "taxation/commuter-benefit-split",
  inputs: [
    {
      id: "monthlyTransitBenefit",
      label: "Monthly transit benefit",
      kind: "number",
      minimum: 0,
    },
    {
      id: "monthlyParkingBenefit",
      label: "Monthly parking benefit",
      kind: "number",
      minimum: 0,
    },
    {
      id: "transitExclusionCap",
      label: "Transit exclusion cap",
      kind: "number",
      minimum: 0,
    },
    {
      id: "parkingExclusionCap",
      label: "Parking exclusion cap",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "excludedTransit",
      label: "Excluded transit benefit",
      kind: "number",
      minimum: 0,
    },
    {
      id: "excludedParking",
      label: "Excluded parking benefit",
      kind: "number",
      minimum: 0,
    },
    {
      id: "taxableExcess",
      label: "Combined taxable excess",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "Commuter Benefit Split",
});

export const run = tool.execute;
export default tool;
