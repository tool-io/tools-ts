import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ProteinRequirementInput = Readonly<{
  readonly dailyFeedKilograms: number;
  readonly feedProteinPercent: number;
}>;
export type ProteinRequirementOutput = Readonly<{
  readonly dietaryProteinKgPerDay: number;
}>;

export const calculateProteinRequirement = (
  x: ProteinRequirementInput,
): ProteinRequirementOutput => {
  if (!Number.isFinite(x.dailyFeedKilograms) || x.dailyFeedKilograms < 0)
    simpleError("dailyFeedKilograms", "Provide a finite nonnegative number.");
  if (
    !Number.isFinite(x.feedProteinPercent) ||
    x.feedProteinPercent < 0 ||
    x.feedProteinPercent > 100
  )
    simpleError(
      "feedProteinPercent",
      "Provide a finite nonnegative number no greater than 100.",
    );
  const dietaryProteinKgPerDay =
    (x.dailyFeedKilograms * x.feedProteinPercent) / 100;
  if (!Number.isFinite(dietaryProteinKgPerDay))
    simpleError(
      "dietaryProteinKgPerDay",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    dietaryProteinKgPerDay: Object.is(dietaryProteinKgPerDay, -0)
      ? 0
      : dietaryProteinKgPerDay,
  };
};

export const example = {
  input: {
    dailyFeedKilograms: 100,
    feedProteinPercent: 40,
  },
  output: { dietaryProteinKgPerDay: 40 },
} satisfies ToolExample<ProteinRequirementInput, ProteinRequirementOutput>;

export const tool = createSimpleTool({
  id: "aquaculture/protein-requirement",
  title: "Protein Requirement",
  description:
    "Calculate protein delivered by a daily feed ration from the feed's stated protein mass percentage.",
  inputs: [
    {
      id: "dailyFeedKilograms",
      kind: "number",
      label: "Daily Feed Kilograms",
      unit: "kg/day",
    },
    {
      id: "feedProteinPercent",
      kind: "number",
      label: "Feed Protein Percent",
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "dietaryProteinKgPerDay",
      kind: "number",
      label: "Dietary Protein Kg Per Day",
      unit: "kg/day",
    },
  ],
  calculate: (input) =>
    calculateProteinRequirement({
      dailyFeedKilograms: input.dailyFeedKilograms as number,
      feedProteinPercent: input.feedProteinPercent as number,
    }),
});
export const runProteinRequirement = tool.execute;
export default tool;
