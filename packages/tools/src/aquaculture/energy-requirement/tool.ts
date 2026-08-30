import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EnergyRequirementInput = Readonly<{
  readonly dailyFeedKilograms: number;
  readonly feedEnergyMjPerKg: number;
}>;
export type EnergyRequirementOutput = Readonly<{
  readonly dietaryEnergyMjPerDay: number;
}>;

export const calculateEnergyRequirement = (
  x: EnergyRequirementInput,
): EnergyRequirementOutput => {
  if (!Number.isFinite(x.dailyFeedKilograms) || x.dailyFeedKilograms < 0)
    simpleError("dailyFeedKilograms", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.feedEnergyMjPerKg) || x.feedEnergyMjPerKg < 0)
    simpleError("feedEnergyMjPerKg", "Provide a finite nonnegative number.");
  const dietaryEnergyMjPerDay = x.dailyFeedKilograms * x.feedEnergyMjPerKg;
  if (!Number.isFinite(dietaryEnergyMjPerDay))
    simpleError(
      "dietaryEnergyMjPerDay",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    dietaryEnergyMjPerDay: Object.is(dietaryEnergyMjPerDay, -0)
      ? 0
      : dietaryEnergyMjPerDay,
  };
};

export const example = {
  input: {
    dailyFeedKilograms: 100,
    feedEnergyMjPerKg: 15,
  },
  output: { dietaryEnergyMjPerDay: 1500 },
} satisfies ToolExample<EnergyRequirementInput, EnergyRequirementOutput>;

export const tool = createSimpleTool({
  id: "aquaculture/energy-requirement",
  title: "Energy Requirement",
  description:
    "Calculate energy supplied by a feed ration; it does not infer a species' metabolic requirement.",
  inputs: [
    {
      id: "dailyFeedKilograms",
      kind: "number",
      label: "Daily Feed Kilograms",
      unit: "kg/day",
    },
    {
      id: "feedEnergyMjPerKg",
      kind: "number",
      label: "Feed Energy Mj Per Kg",
      unit: "MJ/kg",
    },
  ],
  outputs: [
    {
      id: "dietaryEnergyMjPerDay",
      kind: "number",
      label: "Dietary Energy Mj Per Day",
      unit: "MJ/day",
    },
  ],
  calculate: (input) =>
    calculateEnergyRequirement({
      dailyFeedKilograms: input.dailyFeedKilograms as number,
      feedEnergyMjPerKg: input.feedEnergyMjPerKg as number,
    }),
});
export const runEnergyRequirement = tool.execute;
export default tool;
