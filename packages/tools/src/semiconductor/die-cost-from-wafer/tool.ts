import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DieCostFromWaferInput = {
  readonly dieYieldPercent: number;
  readonly grossDies: number;
  readonly waferCostEur: number;
};

export type DieCostFromWaferOutput = {
  readonly costPerGoodDieEur: number;
};

export const dieCostFromWaferExample = {
  input: { dieYieldPercent: 80, grossDies: 678, waferCostEur: 5000 },
  output: { costPerGoodDieEur: 9.218289085545724 },
} satisfies ToolExample<DieCostFromWaferInput, DieCostFromWaferOutput>;

export const calculateDieCostFromWafer = (
  input: DieCostFromWaferInput,
): DieCostFromWaferOutput => {
  const waferCostEur = input.waferCostEur;
  const grossDies = input.grossDies;
  const dieYieldPercent = input.dieYieldPercent;

  if (!Number.isFinite(waferCostEur) || waferCostEur <= 0)
    simpleError(
      "waferCostEur",
      "Wafer cost must be a finite positive number.",
      "invalid_wafer_cost",
    );
  if (
    !Number.isFinite(grossDies) ||
    !Number.isSafeInteger(grossDies) ||
    grossDies < 1
  )
    simpleError(
      "grossDies",
      "Gross dies must be a finite safe integer at least 1.",
      "invalid_field",
    );
  if (
    !Number.isFinite(dieYieldPercent) ||
    dieYieldPercent <= 0 ||
    dieYieldPercent > 100
  )
    simpleError(
      "dieYieldPercent",
      "Die yield must be a finite number greater than 0 and at most 100.",
      "invalid_field",
    );

  const goodDies = (grossDies * dieYieldPercent) / 100;
  if (!Number.isFinite(goodDies) || goodDies <= 0)
    simpleError(
      "grossDies",
      "Good dies could not be calculated.",
      "numeric_overflow",
    );

  const costPerGoodDieEur = waferCostEur / goodDies;
  if (!Number.isFinite(costPerGoodDieEur) || costPerGoodDieEur === 0)
    simpleError(
      "waferCostEur",
      "Cost per good die is outside the representable positive range.",
      costPerGoodDieEur === 0 ? "numeric_underflow" : "numeric_overflow",
    );

  return {
    costPerGoodDieEur: costPerGoodDieEur === 0 ? 0 : costPerGoodDieEur,
  };
};

export const dieCostFromWaferTool = createSimpleTool({
  calculate: (input) =>
    calculateDieCostFromWafer({
      dieYieldPercent: input.dieYieldPercent as number,
      grossDies: input.grossDies as number,
      waferCostEur: input.waferCostEur as number,
    }),
  description:
    "Divide the wafer cost by the good dies per wafer to obtain the cost per good die. Formula: C_good [EUR] = C_wafer [EUR] / (N_gross · Y [%]/100), where N_gross is gross dies per wafer and Y is the die yield. Inputs: C_wafer > 0 EUR, N_gross ≥ 1 integer, and 0 < Y ≤ 100 %. Output: C_good > 0 EUR. Assumes uniform yield and that wafer cost amortizes only over good dies.",
  id: "semiconductor/die-cost-from-wafer",
  inputs: [
    {
      description: "Total wafer cost. Must be greater than 0 EUR.",
      id: "waferCostEur",
      kind: "number",
      label: "Wafer cost",
      minimum: Number.MIN_VALUE,
      unit: "EUR",
    },
    {
      description: "Gross dies per wafer. Must be a safe integer at least 1.",
      id: "grossDies",
      kind: "integer",
      label: "Gross dies per wafer",
      minimum: 1,
    },
    {
      description:
        "Die yield percentage. Must be greater than 0 and at most 100.",
      id: "dieYieldPercent",
      kind: "number",
      label: "Die yield",
      maximum: 100,
      minimum: Number.MIN_VALUE,
      unit: "%",
    },
  ],
  outputs: [
    {
      description: "Cost per good die. At least 0 EUR.",
      id: "costPerGoodDieEur",
      kind: "number",
      label: "Cost per good die",
      minimum: Number.MIN_VALUE,
      unit: "EUR",
    },
  ],
  title: "Die Cost From Wafer Calculator",
});
export const runDieCostFromWafer = dieCostFromWaferTool.execute;
export default dieCostFromWaferTool;
