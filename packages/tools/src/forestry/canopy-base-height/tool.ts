import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CanopyBaseHeightInput = Readonly<{
  readonly treeHeightMeters: number;
  readonly liveCrownMeters: number;
}>;
export type CanopyBaseHeightOutput = Readonly<{
  readonly baseHeightMeters: number;
}>;

export const calculateCanopyBaseHeight = (
  x: CanopyBaseHeightInput,
): CanopyBaseHeightOutput => {
  if (!Number.isFinite(x.treeHeightMeters) || x.treeHeightMeters <= 0)
    simpleError("treeHeightMeters", "Provide a finite positive number.");
  if (!Number.isFinite(x.liveCrownMeters) || x.liveCrownMeters < 0)
    simpleError("liveCrownMeters", "Provide a finite nonnegative number.");
  if (!(x.liveCrownMeters <= x.treeHeightMeters))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const baseHeightMeters = x.treeHeightMeters - x.liveCrownMeters;
  if (!Number.isFinite(baseHeightMeters))
    simpleError(
      "baseHeightMeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    baseHeightMeters: Object.is(baseHeightMeters, -0) ? 0 : baseHeightMeters,
  };
};

export const example = {
  input: {
    treeHeightMeters: 20,
    liveCrownMeters: 10,
  },
  output: { baseHeightMeters: 10 },
} satisfies ToolExample<CanopyBaseHeightInput, CanopyBaseHeightOutput>;

export const tool = createSimpleTool({
  id: "forestry/canopy-base-height",
  title: "Canopy Base Height",
  description:
    "Height above ground of live-crown base from tree height minus live crown length.",
  inputs: [
    {
      id: "treeHeightMeters",
      kind: "number",
      label: "Tree Height Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "liveCrownMeters",
      kind: "number",
      label: "Live Crown Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "baseHeightMeters",
      kind: "number",
      label: "Base Height Meters",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateCanopyBaseHeight({
      treeHeightMeters: input.treeHeightMeters as number,
      liveCrownMeters: input.liveCrownMeters as number,
    }),
});
export const canopyBaseHeightTool = tool;
export const runCanopyBaseHeight = tool.execute;
export default tool;
