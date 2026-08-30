import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CrownRatioInput = Readonly<{
  readonly liveCrownMeters: number;
  readonly totalHeightMeters: number;
}>;
export type CrownRatioOutput = Readonly<{
  readonly crownRatioPercent: number;
}>;

export const calculateCrownRatio = (x: CrownRatioInput): CrownRatioOutput => {
  if (!Number.isFinite(x.liveCrownMeters) || x.liveCrownMeters < 0)
    simpleError("liveCrownMeters", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.totalHeightMeters) || x.totalHeightMeters <= 0)
    simpleError("totalHeightMeters", "Provide a finite positive number.");
  if (!(x.liveCrownMeters <= x.totalHeightMeters))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const crownRatioPercent = (100 * x.liveCrownMeters) / x.totalHeightMeters;
  if (!Number.isFinite(crownRatioPercent))
    simpleError(
      "crownRatioPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    crownRatioPercent: Object.is(crownRatioPercent, -0) ? 0 : crownRatioPercent,
  };
};

export const example = {
  input: {
    liveCrownMeters: 10,
    totalHeightMeters: 20,
  },
  output: { crownRatioPercent: 50 },
} satisfies ToolExample<CrownRatioInput, CrownRatioOutput>;

export const tool = createSimpleTool({
  id: "forestry/crown-ratio",
  title: "Crown Ratio",
  description: "Live crown length as a percentage of total tree height.",
  inputs: [
    {
      id: "liveCrownMeters",
      kind: "number",
      label: "Live Crown Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "totalHeightMeters",
      kind: "number",
      label: "Total Height Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "crownRatioPercent",
      kind: "number",
      label: "Crown Ratio Percent",
      unit: "percent",
    },
  ],
  calculate: (input) =>
    calculateCrownRatio({
      liveCrownMeters: input.liveCrownMeters as number,
      totalHeightMeters: input.totalHeightMeters as number,
    }),
});
export const crownRatioTool = tool;
export const runCrownRatio = tool.execute;
export default tool;
