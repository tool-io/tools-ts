import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BasalAreaIncrementPercentageInput = Readonly<{
  readonly startingBasalArea: number;
  readonly endingBasalArea: number;
}>;
export type BasalAreaIncrementPercentageOutput = Readonly<{
  readonly incrementPercent: number;
}>;

export const calculateBasalAreaIncrementPercentage = (
  x: BasalAreaIncrementPercentageInput,
): BasalAreaIncrementPercentageOutput => {
  if (!Number.isFinite(x.startingBasalArea) || x.startingBasalArea <= 0)
    simpleError("startingBasalArea", "Provide a finite positive number.");
  if (!Number.isFinite(x.endingBasalArea) || x.endingBasalArea < 0)
    simpleError("endingBasalArea", "Provide a finite nonnegative number.");
  const incrementPercent =
    (100 * (x.endingBasalArea - x.startingBasalArea)) / x.startingBasalArea;
  if (!Number.isFinite(incrementPercent))
    simpleError(
      "incrementPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    incrementPercent: Object.is(incrementPercent, -0) ? 0 : incrementPercent,
  };
};

export const example = {
  input: {
    startingBasalArea: 20,
    endingBasalArea: 22,
  },
  output: { incrementPercent: 10 },
} satisfies ToolExample<
  BasalAreaIncrementPercentageInput,
  BasalAreaIncrementPercentageOutput
>;

export const tool = createSimpleTool({
  id: "forestry/basal-area-increment-percentage",
  title: "Basal Area Increment Percentage",
  description:
    "Percentage change in stand basal area from start to end inventory.",
  inputs: [
    {
      id: "startingBasalArea",
      kind: "number",
      label: "Starting Basal Area",
      unit: "m2/ha",
      minimum: 0,
    },
    {
      id: "endingBasalArea",
      kind: "number",
      label: "Ending Basal Area",
      unit: "m2/ha",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "incrementPercent",
      kind: "number",
      label: "Increment Percent",
      unit: "percent",
    },
  ],
  calculate: (input) =>
    calculateBasalAreaIncrementPercentage({
      startingBasalArea: input.startingBasalArea as number,
      endingBasalArea: input.endingBasalArea as number,
    }),
});
export const basalAreaIncrementPercentageTool = tool;
export const runBasalAreaIncrementPercentage = tool.execute;
export default tool;
