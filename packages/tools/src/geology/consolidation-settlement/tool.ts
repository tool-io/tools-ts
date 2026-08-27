import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ConsolidationSettlementInput = {
  readonly layerThicknessM: number;
  readonly initialVoidRatio: number;
  readonly compressionIndex: number;
  readonly initialEffectiveStressKpa: number;
  readonly finalEffectiveStressKpa: number;
};

export type ConsolidationSettlementOutput = {
  readonly settlementM: number;
};

export const calculateConsolidationSettlement = (
  input: ConsolidationSettlementInput,
): ConsolidationSettlementOutput => {
  if (!(input.layerThicknessM > 0))
    simpleError(
      "layerThicknessM",
      "Layer thickness must be greater than zero.",
      "invalid_geometry",
    );
  if (!(input.initialVoidRatio >= 0))
    simpleError(
      "initialVoidRatio",
      "Initial void ratio must be non-negative.",
      "invalid_void_ratio",
    );
  if (!(input.compressionIndex > 0))
    simpleError(
      "compressionIndex",
      "Compression index must be greater than zero.",
      "invalid_index",
    );
  if (!(input.initialEffectiveStressKpa > 0))
    simpleError(
      "initialEffectiveStressKpa",
      "Initial effective stress must be greater than zero.",
      "invalid_stress",
    );
  if (!(input.finalEffectiveStressKpa >= input.initialEffectiveStressKpa))
    simpleError(
      "finalEffectiveStressKpa",
      "Final effective stress must not fall below the initial stress for primary consolidation loading.",
      "invalid_stress",
    );
  return {
    settlementM:
      ((input.layerThicknessM * input.compressionIndex) /
        (1 + input.initialVoidRatio)) *
      Math.log10(
        input.finalEffectiveStressKpa / input.initialEffectiveStressKpa,
      ),
  };
};

export const consolidationSettlementExample = {
  input: {
    layerThicknessM: 4,
    initialVoidRatio: 1,
    compressionIndex: 0.3,
    initialEffectiveStressKpa: 100,
    finalEffectiveStressKpa: 200,
  },
  output: { settlementM: 0.1806179973983887 },
} satisfies ToolExample<
  ConsolidationSettlementInput,
  ConsolidationSettlementOutput
>;

export const consolidationSettlementTool = createSimpleTool({
  id: "geology/consolidation-settlement",
  title: "Consolidation Settlement Calculator",
  description:
    "Primary consolidation settlement of a normally consolidated fine-grained layer Sc = H * Cc / (1 + e0) * log10(sigma_f' / sigma_i'). Assumes virgin compression with Cc; for overconsolidated ranges use Cr instead. Thickness in m, stresses in kPa, settlement in m.",
  inputs: [
    {
      description:
        "Layer thickness H in m (drainage double or single as applicable to the field layer, not divided here).",
      id: "layerThicknessM",
      kind: "number",
      label: "H",
      minimum: 0,
    },
    {
      description: "Initial void ratio e0, dimensionless.",
      id: "initialVoidRatio",
      kind: "number",
      label: "e0",
      minimum: 0,
    },
    {
      description: "Virgin compression index Cc, dimensionless.",
      id: "compressionIndex",
      kind: "number",
      label: "Cc",
      minimum: 0,
    },
    {
      description: "Initial effective vertical stress sigma_i' in kPa.",
      id: "initialEffectiveStressKpa",
      kind: "number",
      label: "sigma i'",
      minimum: 0,
    },
    {
      description:
        "Final effective vertical stress sigma_f' = sigma_i' + delta_sigma' in kPa.",
      id: "finalEffectiveStressKpa",
      kind: "number",
      label: "sigma f'",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Primary consolidation settlement in m.",
      id: "settlementM",
      kind: "number",
      label: "Sc",
    },
  ],
  calculate: (input) =>
    calculateConsolidationSettlement(
      input as unknown as ConsolidationSettlementInput,
    ),
});

export const runConsolidationSettlement = consolidationSettlementTool.execute;
export default consolidationSettlementTool;
