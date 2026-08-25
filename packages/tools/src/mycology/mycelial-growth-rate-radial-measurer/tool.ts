import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MycelialGrowthRateRadialMeasurerInput = {
  readonly daysElapsedInt: number;
  readonly finalRadiusMm: number;
  readonly initialRadiusMm: number;
};

export type MycelialGrowthRateRadialMeasurerOutput = {
  readonly radialGrowthMmPerDay: number;
};

export const mycelialGrowthRateRadialMeasurerExample = {
  input: { daysElapsedInt: 10, finalRadiusMm: 30, initialRadiusMm: 5 },
  output: { radialGrowthMmPerDay: 2.5 },
} satisfies ToolExample<
  MycelialGrowthRateRadialMeasurerInput,
  MycelialGrowthRateRadialMeasurerOutput
>;

export const mycelialGrowthRateRadialMeasurerTool = createSimpleTool({
  id: "mycology/mycelial-growth-rate-radial-measurer",
  title: "Radial Growth Rate",
  description:
    "Calculate radial mycelial growth in millimetres per day from the change between initial and final colony radius over elapsed time.",
  inputs: [
    {
      id: "initialRadiusMm",
      kind: "number",
      label: "Initial colony radius",
      minimum: 0,
      unit: "mm",
    },
    {
      id: "finalRadiusMm",
      kind: "number",
      label: "Final colony radius",
      minimum: 0,
      unit: "mm",
    },
    {
      id: "daysElapsedInt",
      kind: "integer",
      label: "Days elapsed",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "radialGrowthMmPerDay",
      label: "Radial growth rate",
      kind: "number",
      unit: "mm/day",
    },
  ],
  calculate: (input) => {
    const initialRadiusMm = input.initialRadiusMm as number;
    const finalRadiusMm = input.finalRadiusMm as number;
    const daysElapsedInt = input.daysElapsedInt as number;
    if (finalRadiusMm < initialRadiusMm)
      simpleError(
        "finalRadiusMm",
        "Final colony radius must be at least the initial radius.",
      );
    return {
      radialGrowthMmPerDay: (finalRadiusMm - initialRadiusMm) / daysElapsedInt,
    };
  },
});
export const runMycelialGrowthRateRadialMeasurer =
  mycelialGrowthRateRadialMeasurerTool.execute;
export default mycelialGrowthRateRadialMeasurerTool;
