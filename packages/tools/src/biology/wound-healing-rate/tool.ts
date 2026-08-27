import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const woundHealingRateExample = {
  input: { currentAreaMm2: 60, daysElapsed: 4, initialAreaMm2: 100 },
  output: { healingRateMm2PerDay: 10 },
} satisfies ToolExample<
  {
    readonly currentAreaMm2: number;
    readonly daysElapsed: number;
    readonly initialAreaMm2: number;
  },
  { readonly healingRateMm2PerDay: number }
>;

export const woundHealingRateTool = createSimpleTool({
  id: "biology/wound-healing-rate",
  title: "Wound Healing Rate",
  description:
    "Compute wound healing rate as (initial area - current area) / days elapsed.",
  inputs: [
    {
      id: "initialAreaMm2",
      kind: "number",
      label: "Initial wound area",
      minimum: 0,
      unit: "mm2",
    },
    {
      id: "currentAreaMm2",
      kind: "number",
      label: "Current wound area",
      minimum: 0,
      unit: "mm2",
    },
    {
      id: "daysElapsed",
      kind: "number",
      label: "Days elapsed",
    },
  ],
  outputs: [
    {
      id: "healingRateMm2PerDay",
      kind: "number",
      label: "Healing rate",
      unit: "mm2/day",
    },
  ],
  calculate: (input) => {
    const initialAreaMm2 = input.initialAreaMm2 as number;
    const currentAreaMm2 = input.currentAreaMm2 as number;
    const daysElapsed = input.daysElapsed as number;
    if (!(daysElapsed > 0))
      simpleError("daysElapsed", "Days elapsed must be positive.");
    return {
      healingRateMm2PerDay: (initialAreaMm2 - currentAreaMm2) / daysElapsed,
    };
  },
});
export const runWoundHealingRate = woundHealingRateTool.execute;
export default woundHealingRateTool;
