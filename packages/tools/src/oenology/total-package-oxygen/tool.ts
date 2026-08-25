import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type TotalPackageOxygenInput = {
  readonly bottleVolumeLiters?: number;
  readonly dissolvedOxygenMgPerL: number;
  readonly headspaceMl: number;
};

export type TotalPackageOxygenOutput = {
  readonly totalPackageOxygenMgPerL: number;
};

export const totalPackageOxygenExample = {
  input: {
    bottleVolumeLiters: 0.75,
    dissolvedOxygenMgPerL: 1,
    headspaceMl: 5,
  },
  output: {
    totalPackageOxygenMgPerL: 2.99583666667,
  },
} satisfies ToolExample<TotalPackageOxygenInput, TotalPackageOxygenOutput>;

const OXYGEN_FRACTION_OF_AIR = 0.2095;
const OXYGEN_MG_PER_ML = 1.429;

export const calculateTotalPackageOxygen = (
  input: TotalPackageOxygenInput,
): TotalPackageOxygenOutput => {
  const volume = input.bottleVolumeLiters ?? 0.75;
  if (volume <= 0)
    simpleError(
      "bottleVolumeLiters",
      "The bottle volume must be positive.",
      "invalid_value",
    );
  if (input.dissolvedOxygenMgPerL < 0 || input.headspaceMl < 0)
    simpleError(
      "dissolvedOxygenMgPerL",
      "Dissolved oxygen and headspace volume cannot be negative.",
      "invalid_value",
    );
  const headspaceOxygenMg =
    input.headspaceMl * OXYGEN_FRACTION_OF_AIR * OXYGEN_MG_PER_ML;
  return {
    totalPackageOxygenMgPerL: roundStatistic(
      input.dissolvedOxygenMgPerL + headspaceOxygenMg / volume,
    ),
  };
};

export const totalPackageOxygenTool = createSimpleTool({
  calculate: (input) =>
    calculateTotalPackageOxygen(input as unknown as TotalPackageOxygenInput),
  description:
    "Add dissolved oxygen at the filler to the headspace contribution for the total package oxygen of a sealed bottle.",
  id: "oenology/total-package-oxygen",
  inputs: [
    {
      default: 0.75,
      description: "Filled wine volume in the package.",
      id: "bottleVolumeLiters",
      kind: "number",
      label: "Bottle volume",
      minimum: 0,
      unit: "L",
    },
    {
      description: "Dissolved oxygen measured at the filler.",
      id: "dissolvedOxygenMgPerL",
      kind: "number",
      label: "Dissolved oxygen",
      minimum: 0,
      unit: "mg/L",
    },
    {
      description: "Air trapped under the closure.",
      id: "headspaceMl",
      kind: "number",
      label: "Headspace",
      minimum: 0,
      unit: "mL",
    },
  ],
  outputs: [
    {
      description: "Total package oxygen expressed per liter of wine.",
      id: "totalPackageOxygenMgPerL",
      kind: "number",
      label: "TPO",
      unit: "mg/L",
    },
  ],
  title: "Total Package Oxygen Calculator",
});
export const runTotalPackageOxygen = totalPackageOxygenTool.execute;
export default totalPackageOxygenTool;
