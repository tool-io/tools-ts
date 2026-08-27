import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SecondaryCompressionSettlementInput = {
  readonly layerThicknessM: number;
  readonly secondaryCompressionIndex: number;
  readonly endOfPrimaryVoidRatio: number;
  readonly startTimeYears: number;
  readonly endTimeYears: number;
};

export type SecondaryCompressionSettlementOutput = {
  readonly settlementM: number;
};

export const calculateSecondaryCompressionSettlement = (
  input: SecondaryCompressionSettlementInput,
): SecondaryCompressionSettlementOutput => {
  if (!(input.layerThicknessM > 0))
    simpleError(
      "layerThicknessM",
      "Layer thickness must be greater than zero.",
      "invalid_geometry",
    );
  if (!(input.secondaryCompressionIndex > 0))
    simpleError(
      "secondaryCompressionIndex",
      "Secondary compression index must be greater than zero.",
      "invalid_index",
    );
  if (!(input.endOfPrimaryVoidRatio >= 0))
    simpleError(
      "endOfPrimaryVoidRatio",
      "End-of-primary void ratio must be non-negative.",
      "invalid_void_ratio",
    );
  if (
    !(input.startTimeYears > 0) ||
    !(input.endTimeYears > input.startTimeYears)
  )
    simpleError(
      "endTimeYears",
      "Creep end time must exceed the start time and both be positive.",
      "invalid_time",
    );
  return {
    settlementM:
      ((input.layerThicknessM * input.secondaryCompressionIndex) /
        (1 + input.endOfPrimaryVoidRatio)) *
      Math.log10(input.endTimeYears / input.startTimeYears),
  };
};

export const secondaryCompressionSettlementExample = {
  input: {
    layerThicknessM: 4,
    secondaryCompressionIndex: 0.004,
    endOfPrimaryVoidRatio: 1,
    startTimeYears: 1,
    endTimeYears: 10,
  },
  output: { settlementM: 0.008 },
} satisfies ToolExample<
  SecondaryCompressionSettlementInput,
  SecondaryCompressionSettlementOutput
>;

export const secondaryCompressionSettlementTool = createSimpleTool({
  id: "geology/secondary-compression-settlement",
  title: "Secondary Compression Settlement Calculator",
  description:
    "Secondary (creep) settlement Ss = H * C_alpha / (1 + e_p) * log10(t2 / t1), where C_alpha is the secondary compression index from the e - log10 t tail of an oedometer test, e_p the void ratio at end of primary consolidation, and t1, t2 the creep time window in years.",
  inputs: [
    {
      description: "Layer thickness H in m.",
      id: "layerThicknessM",
      kind: "number",
      label: "H",
      minimum: 0,
    },
    {
      description: "Secondary compression index C_alpha, dimensionless.",
      id: "secondaryCompressionIndex",
      kind: "number",
      label: "C alpha",
      minimum: 0,
    },
    {
      description: "Void ratio e_p at the end of primary consolidation.",
      id: "endOfPrimaryVoidRatio",
      kind: "number",
      label: "e p",
      minimum: 0,
    },
    {
      description: "Start of creep window t1 in years.",
      id: "startTimeYears",
      kind: "number",
      label: "t1",
      minimum: 0,
    },
    {
      description: "End of creep window t2 in years.",
      id: "endTimeYears",
      kind: "number",
      label: "t2",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Secondary compression settlement in m.",
      id: "settlementM",
      kind: "number",
      label: "Ss",
    },
  ],
  calculate: (input) =>
    calculateSecondaryCompressionSettlement(
      input as unknown as SecondaryCompressionSettlementInput,
    ),
});

export const runSecondaryCompressionSettlement =
  secondaryCompressionSettlementTool.execute;
export default secondaryCompressionSettlementTool;
