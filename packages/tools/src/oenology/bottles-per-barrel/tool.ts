import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type BottlesPerBarrelInput = {
  readonly barrelCount?: number;
  readonly barrelVolumeLiters?: number;
  readonly bottleMl?: number;
};

export type BottlesPerBarrelOutput = {
  readonly totalBottles: number;
  readonly wholeBottles: number;
};

export const bottlesPerBarrelExample = {
  input: {
    barrelCount: 20,
    barrelVolumeLiters: 225,
    bottleMl: 750,
  },
  output: {
    totalBottles: 6000,
    wholeBottles: 6000,
  },
} satisfies ToolExample<BottlesPerBarrelInput, BottlesPerBarrelOutput>;

export const calculateBottlesPerBarrel = (
  input: BottlesPerBarrelInput,
): BottlesPerBarrelOutput => {
  const barrelVolume = input.barrelVolumeLiters ?? 225;
  const bottleMl = input.bottleMl ?? 750;
  if (bottleMl <= 0)
    simpleError(
      "bottleMl",
      "The bottle size must be positive.",
      "invalid_value",
    );
  const bottleEquivalent =
    (barrelVolume * (input.barrelCount ?? 1) * 1000) / bottleMl;
  return {
    totalBottles: roundStatistic(bottleEquivalent),
    wholeBottles: Math.floor(bottleEquivalent),
  };
};

export const bottlesPerBarrelTool = createSimpleTool({
  calculate: (input) =>
    calculateBottlesPerBarrel(input as unknown as BottlesPerBarrelInput),
  description:
    "Translate barrel inventory into bottle counts at the chosen bottle format.",
  id: "oenology/bottles-per-barrel",
  inputs: [
    {
      default: 20,
      description: "Barrels going to bottling.",
      id: "barrelCount",
      kind: "integer",
      label: "Barrels",
      minimum: 0,
    },
    {
      default: 225,
      description: "Working volume of one barrel.",
      id: "barrelVolumeLiters",
      kind: "number",
      label: "Barrel volume",
      minimum: 0,
      unit: "L",
    },
    {
      default: 750,
      description: "Bottle fill in milliliters.",
      id: "bottleMl",
      kind: "number",
      label: "Bottle size",
      minimum: 0,
      unit: "mL",
    },
  ],
  outputs: [
    {
      description:
        "Exact bottle equivalent, including a fractional last bottle.",
      id: "totalBottles",
      kind: "number",
      label: "Total bottles",
    },
    {
      description: "Whole bottles that can be completely filled.",
      id: "wholeBottles",
      kind: "integer",
      label: "Whole bottles",
    },
  ],
  title: "Bottles per Barrel Calculator",
});
export const runBottlesPerBarrel = bottlesPerBarrelTool.execute;
export default bottlesPerBarrelTool;
