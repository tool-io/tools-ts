import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ProductionYieldInput = Readonly<{
  readonly harvestedBiomassKilograms: number;
  readonly productionAreaHectares: number;
}>;
export type ProductionYieldOutput = Readonly<{
  readonly yieldKgPerHectare: number;
}>;

export const calculateProductionYield = (
  x: ProductionYieldInput,
): ProductionYieldOutput => {
  if (
    !Number.isFinite(x.harvestedBiomassKilograms) ||
    x.harvestedBiomassKilograms < 0
  )
    simpleError(
      "harvestedBiomassKilograms",
      "Provide a finite nonnegative number.",
    );
  if (
    !Number.isFinite(x.productionAreaHectares) ||
    x.productionAreaHectares <= 0
  )
    simpleError("productionAreaHectares", "Provide a finite positive number.");
  const yieldKgPerHectare =
    x.harvestedBiomassKilograms / x.productionAreaHectares;
  if (!Number.isFinite(yieldKgPerHectare))
    simpleError(
      "yieldKgPerHectare",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    yieldKgPerHectare: Object.is(yieldKgPerHectare, -0) ? 0 : yieldKgPerHectare,
  };
};

export const example = {
  input: {
    harvestedBiomassKilograms: 1000,
    productionAreaHectares: 2,
  },
  output: { yieldKgPerHectare: 500 },
} satisfies ToolExample<ProductionYieldInput, ProductionYieldOutput>;

export const tool = createSimpleTool({
  id: "aquaculture/production-yield",
  title: "Production Yield",
  description:
    "Calculate harvested live weight per hectare of production area.",
  inputs: [
    {
      id: "harvestedBiomassKilograms",
      kind: "number",
      label: "Harvested Biomass Kilograms",
      unit: "kg",
    },
    {
      id: "productionAreaHectares",
      kind: "number",
      label: "Production Area Hectares",
      unit: "ha",
    },
  ],
  outputs: [
    {
      id: "yieldKgPerHectare",
      kind: "number",
      label: "Yield Kg Per Hectare",
      unit: "kg/ha",
    },
  ],
  calculate: (input) =>
    calculateProductionYield({
      harvestedBiomassKilograms: input.harvestedBiomassKilograms as number,
      productionAreaHectares: input.productionAreaHectares as number,
    }),
});
export const runProductionYield = tool.execute;
export default tool;
