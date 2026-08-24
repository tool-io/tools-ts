import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ApothecaryWeightConverterInput = {
  readonly amount: number;
  readonly unit?: "grain" | "scruple" | "dram" | "ounce" | "pound";
};

export type ApothecaryWeightConverterOutput = {
  readonly totalGrains: number;
  readonly grams: number;
  readonly totalScruples: number;
  readonly totalOunces: number;
};

const GRAINS_PER_UNIT = {
  grain: 1,
  scruple: 20,
  dram: 60,
  ounce: 480,
  pound: 5760,
} as const;
const GRAMS_PER_GRAIN = 0.06479891;

export const calculateApothecaryWeightConverter = (
  input: ApothecaryWeightConverterInput,
): ApothecaryWeightConverterOutput => {
  if (!(
    typeof input.amount === "number" &&
    Number.isFinite(input.amount) &&
    input.amount > 0
  ))
    return simpleError(
      "amount",
      "Amount must be a finite number greater than zero.",
      "invalid_amount",
    );
  const totalGrains = input.amount * GRAINS_PER_UNIT[input.unit ?? "grain"];
  const grams = totalGrains * GRAMS_PER_GRAIN;
  if (!(
    Number.isFinite(totalGrains) &&
    totalGrains > 0 &&
    Number.isFinite(grams) &&
    grams > 0
  ))
    return simpleError(
      "amount",
      "The converted mass is outside the finite numeric range.",
      "numeric_range",
    );
  return {
    totalGrains,
    grams,
    totalScruples: totalGrains / 20,
    totalOunces: totalGrains / 480,
  };
};

export const apothecaryWeightConverterExample = {
  input: { amount: 3, unit: "dram" },
  output: {
    totalGrains: 180,
    grams: 11.6638038,
    totalScruples: 9,
    totalOunces: 0.375,
  },
} satisfies ToolExample<
  ApothecaryWeightConverterInput,
  ApothecaryWeightConverterOutput
>;

export const apothecaryWeightConverterTool = createSimpleTool({
  id: "paleography/apothecary-weight-converter",
  title: "Apothecary Weight Converter",
  description:
    "Convert apothecaries' weights on the ladder 1 pound = 12 ounces = 96 drams = 288 scruples = 5760 grains (grain fixed at exactly 0.06479891 g).",
  inputs: [
    {
      description: "Quantity of the chosen unit.",
      id: "amount",
      kind: "number",
      label: "Amount",
      minimum: Number.MIN_VALUE,
    },
    {
      default: "grain",
      description: "Unit of the entered amount.",
      enum: ["grain", "scruple", "dram", "ounce", "pound"],
      id: "unit",
      kind: "string",
      label: "Unit",
    },
  ],
  outputs: [
    {
      description: "Mass in troy/apothecary grains.",
      id: "totalGrains",
      kind: "number",
      label: "Grains",
    },
    {
      description: "Mass in metric grams.",
      id: "grams",
      kind: "number",
      label: "Grams",
    },
    {
      description: "Mass in scruples.",
      id: "totalScruples",
      kind: "number",
      label: "Scruples",
    },
    {
      description: "Mass in apothecary ounces.",
      id: "totalOunces",
      kind: "number",
      label: "Ounces",
    },
  ],
  calculate: (input) =>
    calculateApothecaryWeightConverter({
      amount: input.amount as number,
      unit: input.unit as ApothecaryWeightConverterInput["unit"],
    }),
});

export const runApothecaryWeightConverter =
  apothecaryWeightConverterTool.execute;
export default apothecaryWeightConverterTool;
