import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const substrateSupplementationPlannerExample = {
  input: { substrateDryMassKg: 20, supplementPercentWw: 5 },
  output: { supplementMassKg: 1 },
} satisfies ToolExample<
  {
    readonly substrateDryMassKg: number;
    readonly supplementPercentWw: number;
  },
  {
    readonly supplementMassKg: number;
  }
>;

export const substrateSupplementationPlannerTool = createSimpleTool({
  id: "mycology/substrate-supplementation-planner",
  title: "Supplementation Planner",
  description:
    "Calculate supplement mass as a percentage of dry substrate mass; this is a dry-substrate basis, not percentage of the final combined mixture.",
  inputs: [
    {
      id: "substrateDryMassKg",
      label: "Substrate dry mass",
      kind: "number",
      minimum: Number.MIN_VALUE,
      unit: "kg",
    },
    {
      id: "supplementPercentWw",
      label: "Supplement percent of dry substrate",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "supplementMassKg",
      label: "Supplement mass",
      kind: "number",
      minimum: 0,
      unit: "kg",
    },
  ],
  calculate: (input) => {
    const substrateDryMassKg = input.substrateDryMassKg as number;
    if (substrateDryMassKg <= 0)
      simpleError(
        "substrateDryMassKg",
        "Substrate dry mass must be greater than zero.",
      );
    return {
      supplementMassKg:
        (substrateDryMassKg * (input.supplementPercentWw as number)) / 100,
    };
  },
});
export const runSubstrateSupplementationPlanner =
  substrateSupplementationPlannerTool.execute;
export default substrateSupplementationPlannerTool;
