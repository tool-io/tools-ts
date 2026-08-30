import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly openingPointsLiability: number;
  readonly pointsIssuedValue: number;
  readonly pointsRedeemedValue: number;
  readonly pointsExpiredValue: number;
}>;
export type Output = Readonly<{
  readonly closingPointsLiability: number;
  readonly breakagePercentOfAvailable: number;
  readonly redemptionPercentOfAvailable: number;
}>;

export const calculate = (input: Input): Output => {
  const available = input.openingPointsLiability + input.pointsIssuedValue;
  if (input.pointsRedeemedValue + input.pointsExpiredValue > available)
    simpleError(
      "pointsRedeemedValue",
      "Redeemed and expired value cannot exceed available points.",
      "invalid_rollforward",
    );
  return {
    closingPointsLiability:
      available - input.pointsRedeemedValue - input.pointsExpiredValue,
    breakagePercentOfAvailable:
      available === 0 ? 0 : (input.pointsExpiredValue / available) * 100,
    redemptionPercentOfAvailable:
      available === 0 ? 0 : (input.pointsRedeemedValue / available) * 100,
  };
};

export const exampleInput = {
  openingPointsLiability: 1000,
  pointsIssuedValue: 500,
  pointsRedeemedValue: 300,
  pointsExpiredValue: 150,
} satisfies Input;
export const exampleOutput = {
  closingPointsLiability: 1050,
  breakagePercentOfAvailable: 10,
  redemptionPercentOfAvailable: 20,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      openingPointsLiability: input.openingPointsLiability as number,
      pointsIssuedValue: input.pointsIssuedValue as number,
      pointsRedeemedValue: input.pointsRedeemedValue as number,
      pointsExpiredValue: input.pointsExpiredValue as number,
    }),
  description: "Roll forward frequent-flyer liability and calculate breakage.",
  id: "auditing/frequent-flyer-breakage",
  inputs: [
    {
      id: "openingPointsLiability",
      label: "Opening points liability",
      kind: "number",
      minimum: 0,
    },
    {
      id: "pointsIssuedValue",
      label: "Value of points issued",
      kind: "number",
      minimum: 0,
    },
    {
      id: "pointsRedeemedValue",
      label: "Value of points redeemed",
      kind: "number",
      minimum: 0,
    },
    {
      id: "pointsExpiredValue",
      label: "Value of points expired",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "closingPointsLiability",
      label: "Closing points liability",
      kind: "number",
      minimum: 0,
    },
    {
      id: "breakagePercentOfAvailable",
      label: "Breakage share of available points",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
    {
      id: "redemptionPercentOfAvailable",
      label: "Redemption share of available points",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
  ],
  title: "Frequent-Flyer Breakage",
});

export const run = tool.execute;
export default tool;
