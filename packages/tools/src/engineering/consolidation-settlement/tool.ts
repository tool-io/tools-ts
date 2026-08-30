import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ConsolidationSettlementInput = Readonly<{
  readonly compressionIndex: number;
  readonly layerThicknessMeters: number;
  readonly initialVoidRatio: number;
  readonly initialEffectiveStressPascals: number;
  readonly stressIncreasePascals: number;
}>;
export type ConsolidationSettlementOutput = Readonly<{
  readonly settlementMeters: number;
}>;

export const calculateConsolidationSettlement = (
  x: ConsolidationSettlementInput,
): ConsolidationSettlementOutput => {
  if (!Number.isFinite(x.compressionIndex) || x.compressionIndex < 0)
    simpleError("compressionIndex", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.layerThicknessMeters) || x.layerThicknessMeters < 0)
    simpleError("layerThicknessMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.initialVoidRatio) || x.initialVoidRatio < 0)
    simpleError("initialVoidRatio", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.initialEffectiveStressPascals) ||
    x.initialEffectiveStressPascals < 0
  )
    simpleError(
      "initialEffectiveStressPascals",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.stressIncreasePascals) || x.stressIncreasePascals < 0)
    simpleError("stressIncreasePascals", "Provide a finite number at least 0.");
  const settlementMeters =
    ((x.compressionIndex * x.layerThicknessMeters) / (1 + x.initialVoidRatio)) *
    Math.log10(
      (x.initialEffectiveStressPascals + x.stressIncreasePascals) /
        x.initialEffectiveStressPascals,
    );
  if (!Number.isFinite(settlementMeters))
    simpleError(
      "settlementMeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    settlementMeters: Object.is(settlementMeters, -0) ? 0 : settlementMeters,
  };
};

export const example = {
  input: {
    compressionIndex: 0.2,
    layerThicknessMeters: 5,
    initialVoidRatio: 0.8,
    initialEffectiveStressPascals: 100000,
    stressIncreasePascals: 50000,
  },
  output: { settlementMeters: 0.09782847725315624 },
} satisfies ToolExample<
  ConsolidationSettlementInput,
  ConsolidationSettlementOutput
>;

export const tool = createSimpleTool({
  id: "engineering/consolidation-settlement",
  title: "Consolidation Settlement",
  description:
    "One-dimensional primary consolidation of normally consolidated soil: S=Cc H/(1+e0) log10((σ0+Δσ)/σ0).",
  inputs: [
    {
      id: "compressionIndex",
      kind: "number",
      label: "Compression Index",
      minimum: 0,
    },
    {
      id: "layerThicknessMeters",
      kind: "number",
      label: "Layer Thickness Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "initialVoidRatio",
      kind: "number",
      label: "Initial Void Ratio",
      minimum: 0,
    },
    {
      id: "initialEffectiveStressPascals",
      kind: "number",
      label: "Initial Effective Stress Pascals",
      unit: "Pa",
      minimum: 0,
    },
    {
      id: "stressIncreasePascals",
      kind: "number",
      label: "Stress Increase Pascals",
      unit: "Pa",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "settlementMeters",
      kind: "number",
      label: "Settlement Meters",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateConsolidationSettlement({
      compressionIndex: input.compressionIndex as number,
      layerThicknessMeters: input.layerThicknessMeters as number,
      initialVoidRatio: input.initialVoidRatio as number,
      initialEffectiveStressPascals:
        input.initialEffectiveStressPascals as number,
      stressIncreasePascals: input.stressIncreasePascals as number,
    }),
});
export const consolidationSettlementTool = tool;
export const runConsolidationSettlement = tool.execute;
export default tool;
