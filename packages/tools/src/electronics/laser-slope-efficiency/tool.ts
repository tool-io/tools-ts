import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LaserSlopeEfficiencyInput = Readonly<{
  readonly powerChangeWatts: number;
  readonly currentChangeAmperes: number;
}>;
export type LaserSlopeEfficiencyOutput = Readonly<{
  readonly wattsPerAmpere: number;
}>;

export const calculateLaserSlopeEfficiency = (
  x: LaserSlopeEfficiencyInput,
): LaserSlopeEfficiencyOutput => {
  if (!Number.isFinite(x.powerChangeWatts))
    simpleError("powerChangeWatts", "Provide a finite number.");
  if (!Number.isFinite(x.currentChangeAmperes))
    simpleError("currentChangeAmperes", "Provide a finite number.");
  if (x.powerChangeWatts < 0 || x.currentChangeAmperes <= 0)
    simpleError(
      "input",
      "Above threshold, current must increase and optical power must not decrease.",
    );
  const wattsPerAmpere = x.powerChangeWatts / x.currentChangeAmperes;
  if (!Number.isFinite(wattsPerAmpere))
    simpleError(
      "wattsPerAmpere",
      "Inputs produce an undefined or non-finite result.",
    );
  return { wattsPerAmpere: Object.is(wattsPerAmpere, -0) ? 0 : wattsPerAmpere };
};

export const example = {
  input: { powerChangeWatts: 0.2, currentChangeAmperes: 0.1 },
  output: { wattsPerAmpere: 2 },
} satisfies ToolExample<LaserSlopeEfficiencyInput, LaserSlopeEfficiencyOutput>;

export const tool = createSimpleTool({
  id: "electronics/laser-slope-efficiency",
  title: "Laser Slope Efficiency",
  description:
    "Differential optical power per drive-current change above laser threshold.",
  inputs: [
    {
      id: "powerChangeWatts",
      kind: "number",
      label: "Power Change Watts",
      unit: "W",
    },
    {
      id: "currentChangeAmperes",
      kind: "number",
      label: "Current Change Amperes",
      unit: "A",
    },
  ],
  outputs: [
    {
      id: "wattsPerAmpere",
      kind: "number",
      label: "Watts Per Ampere",
      unit: "W/A",
    },
  ],
  calculate: (input) =>
    calculateLaserSlopeEfficiency({
      powerChangeWatts: input.powerChangeWatts as number,
      currentChangeAmperes: input.currentChangeAmperes as number,
    }),
});
export const laserSlopeEfficiencyTool = tool;
export const runLaserSlopeEfficiency = tool.execute;
export default tool;
