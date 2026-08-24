import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WaferCostPerDieInput = {
  readonly dieHeightMm: number;
  readonly dieWidthMm: number;
  readonly dieYieldPercent: number;
  readonly edgeExclusionMm: number;
  readonly waferCostEur: number;
  readonly waferDiameterMm: number;
};

export type WaferCostPerDieOutput = {
  readonly costPerGoodDieEur: number;
  readonly grossDies: number;
};

export const waferCostPerDieExample = {
  input: {
    dieHeightMm: 10,
    dieWidthMm: 10,
    dieYieldPercent: 80,
    edgeExclusionMm: 3,
    waferCostEur: 5000,
    waferDiameterMm: 300,
  },
  output: { costPerGoodDieEur: 10.195758564437195, grossDies: 613 },
} satisfies ToolExample<WaferCostPerDieInput, WaferCostPerDieOutput>;

export const waferCostPerDieTool = createSimpleTool({
  calculate: (input) => {
    const usableRadiusMm =
      (input.waferDiameterMm as number) / 2 - (input.edgeExclusionMm as number);
    if (!(usableRadiusMm > 0))
      simpleError(
        "waferDiameterMm",
        "Wafer radius must remain positive after edge exclusion.",
        "invalid_wafer_radius",
      );
    if ((input.dieWidthMm as number) <= 0 || (input.dieHeightMm as number) <= 0)
      simpleError(
        "dieWidthMm",
        "Die dimensions must be positive.",
        "invalid_die_dimensions",
      );
    const dieYieldPercent = input.dieYieldPercent as number;
    if (!(dieYieldPercent > 0))
      simpleError(
        "dieYieldPercent",
        "Die yield must be greater than zero.",
        "invalid_yield",
      );
    if ((input.waferCostEur as number) <= 0)
      simpleError(
        "waferCostEur",
        "Wafer cost must be positive.",
        "invalid_wafer_cost",
      );
    const dieAreaMm2 =
      (input.dieWidthMm as number) * (input.dieHeightMm as number);
    const usableDiameterMm = 2 * usableRadiusMm;
    const grossDies = Math.floor(
      (Math.PI * usableRadiusMm * usableRadiusMm) / dieAreaMm2 -
        (Math.PI * usableDiameterMm) / Math.sqrt(2 * dieAreaMm2),
    );
    if (!(grossDies > 0))
      simpleError(
        "dieWidthMm",
        "No complete dies fit on the usable wafer under this approximation.",
        "no_complete_dies",
      );
    return {
      costPerGoodDieEur:
        (input.waferCostEur as number) / ((grossDies * dieYieldPercent) / 100),
      grossDies,
    };
  },
  description:
    "Estimate wafer cost per good die with the standard circular-wafer dies-per-wafer approximation, including edge-loss and yield corrections.",
  id: "semiconductor/wafer-cost-per-die",
  inputs: [
    {
      id: "waferDiameterMm",
      kind: "number",
      label: "Wafer diameter",
      unit: "mm",
    },
    {
      minimum: 0,
      id: "edgeExclusionMm",
      kind: "number",
      label: "Edge exclusion",
      unit: "mm",
    },
    { id: "dieWidthMm", kind: "number", label: "Die width", unit: "mm" },
    { id: "dieHeightMm", kind: "number", label: "Die height", unit: "mm" },
    {
      id: "waferCostEur",
      kind: "number",
      label: "Wafer cost",
      unit: "EUR",
    },
    {
      maximum: 100,
      minimum: 0,
      id: "dieYieldPercent",
      kind: "number",
      label: "Die yield",
      unit: "%",
    },
  ],
  outputs: [
    { id: "grossDies", kind: "integer", label: "Gross dies per wafer" },
    {
      id: "costPerGoodDieEur",
      kind: "number",
      label: "Cost per good die",
      unit: "EUR",
    },
  ],
  title: "Wafer Cost Per Die Calculator",
});
export const runWaferCostPerDie = waferCostPerDieTool.execute;
export default waferCostPerDieTool;
