import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const carryingCapacityCheckerExample = {
  input: { carryingCapacity: 100, currentPopulation: 150 },
  output: { exceedsCapacity: true },
} satisfies ToolExample<
  { readonly carryingCapacity: number; readonly currentPopulation: number },
  { readonly exceedsCapacity: boolean }
>;

export const carryingCapacityCheckerTool = createSimpleTool({
  id: "biology/carrying-capacity-checker",
  title: "Carrying Capacity Check",
  description:
    "Check whether a population exceeds its habitat carrying capacity.",
  inputs: [
    {
      id: "currentPopulation",
      kind: "number",
      label: "Current population",
      minimum: 0,
    },
    {
      id: "carryingCapacity",
      kind: "number",
      label: "Carrying capacity",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "exceedsCapacity",
      kind: "boolean",
      label: "Exceeds capacity",
    },
  ],
  calculate: (input) => ({
    exceedsCapacity:
      (input.currentPopulation as number) > (input.carryingCapacity as number),
  }),
});
export const runCarryingCapacityChecker = carryingCapacityCheckerTool.execute;
export default carryingCapacityCheckerTool;
