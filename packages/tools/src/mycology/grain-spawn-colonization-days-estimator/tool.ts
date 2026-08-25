import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const grainSpawnColonizationDaysEstimatorExample = {
  input: { daysPerLiterAtFullSpawn: 0.4, volumeL: 2 },
  output: { estimatedColonizationDays: 8 },
} satisfies ToolExample<
  {
    readonly daysPerLiterAtFullSpawn: number;
    readonly spawnRatePercent?: number;
    readonly volumeL: number;
  },
  {
    readonly estimatedColonizationDays: number;
  }
>;

export const grainSpawnColonizationDaysEstimatorTool = createSimpleTool({
  id: "mycology/grain-spawn-colonization-days-estimator",
  title: "Colonization Days Estimate",
  description:
    "Estimate grain-spawn colonization time with an explicitly supplied linear-model coefficient; actual time also depends on species, grain, inoculum distribution, temperature, and culture health.",
  inputs: [
    {
      id: "volumeL",
      label: "Volume",
      kind: "number",
      minimum: Number.MIN_VALUE,
      unit: "L",
    },
    {
      default: 10,
      id: "spawnRatePercent",
      label: "Spawn rate percent",
      kind: "number",
      maximum: 50,
      minimum: 1,
    },
    {
      id: "daysPerLiterAtFullSpawn",
      label: "Model coefficient",
      kind: "number",
      minimum: Number.MIN_VALUE,
      unit: "days/L",
    },
  ],
  outputs: [
    {
      id: "estimatedColonizationDays",
      label: "Estimated colonization days",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const volumeL = input.volumeL as number;
    if (volumeL <= 0)
      simpleError("volumeL", "Volume must be greater than zero.");
    const spawnFraction = (input.spawnRatePercent as number) / 100;
    return {
      estimatedColonizationDays:
        (volumeL * (input.daysPerLiterAtFullSpawn as number)) / spawnFraction,
    };
  },
});
export const runGrainSpawnColonizationDaysEstimator =
  grainSpawnColonizationDaysEstimatorTool.execute;
export default grainSpawnColonizationDaysEstimatorTool;
