import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type CasesPerTankInput = {
  readonly bottleMl?: number;
  readonly bottlesPerCase?: number;
  readonly tankVolumeLiters: number;
};

export type CasesPerTankOutput = {
  readonly cases: number;
  readonly wholeCases: number;
};

export const casesPerTankExample = {
  input: {
    bottleMl: 750,
    bottlesPerCase: 12,
    tankVolumeLiters: 2250,
  },
  output: {
    cases: 250,
    wholeCases: 250,
  },
} satisfies ToolExample<CasesPerTankInput, CasesPerTankOutput>;

export const calculateCasesPerTank = (
  input: CasesPerTankInput,
): CasesPerTankOutput => {
  const bottleMl = input.bottleMl ?? 750;
  const perCase = input.bottlesPerCase ?? 12;
  if (bottleMl <= 0 || perCase <= 0)
    simpleError(
      "bottleMl",
      "The bottle size and case count must be positive.",
      "invalid_value",
    );
  const cases = (input.tankVolumeLiters * 1000) / (bottleMl * perCase);
  return {
    cases: roundStatistic(cases),
    wholeCases: Math.floor(cases),
  };
};

export const casesPerTankTool = createSimpleTool({
  calculate: (input) =>
    calculateCasesPerTank(input as unknown as CasesPerTankInput),
  description:
    "Convert available tank volume into exact case equivalents and completely fillable cases at the selected bottle volume and case pack, before filling losses are deducted.",
  id: "oenology/cases-per-tank",
  inputs: [
    {
      default: 750,
      description: "Bottle fill in milliliters.",
      id: "bottleMl",
      kind: "number",
      label: "Bottle size",
      minimum: 0,
      unit: "mL",
    },
    {
      default: 12,
      description: "Bottles packed per case.",
      id: "bottlesPerCase",
      kind: "integer",
      label: "Bottles per case",
      maximum: 100,
      minimum: 1,
    },
    {
      description: "Tank volume available for bottling.",
      id: "tankVolumeLiters",
      kind: "number",
      label: "Tank volume",
      minimum: 0,
      unit: "L",
    },
  ],
  outputs: [
    {
      description: "Exact case equivalent of the tank including part cases.",
      id: "cases",
      kind: "number",
      label: "Cases",
    },
    {
      description: "Whole shippable cases after flooring the part case.",
      id: "wholeCases",
      kind: "integer",
      label: "Whole cases",
    },
  ],
  title: "Cases per Tank Volume Calculator",
});
export const runCasesPerTank = casesPerTankTool.execute;
export default casesPerTankTool;
