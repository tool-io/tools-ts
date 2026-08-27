import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type OverconsolidationRatioInput = {
  readonly preconsolidationPressureKpa: number;
  readonly effectiveOverburdenStressKpa: number;
};

export type OverconsolidationRatioOutput = {
  readonly overconsolidationRatio: number;
  readonly consolidationState:
    "normallyConsolidated" | "overconsolidated" | "underconsolidated";
};

export const calculateOverconsolidationRatio = (
  input: OverconsolidationRatioInput,
): OverconsolidationRatioOutput => {
  if (!(input.preconsolidationPressureKpa > 0))
    simpleError(
      "preconsolidationPressureKpa",
      "Preconsolidation pressure must be greater than zero.",
      "invalid_stress",
    );
  if (!(input.effectiveOverburdenStressKpa > 0))
    simpleError(
      "effectiveOverburdenStressKpa",
      "Current effective overburden stress must be greater than zero.",
      "invalid_stress",
    );
  const overconsolidationRatio =
    input.preconsolidationPressureKpa / input.effectiveOverburdenStressKpa;
  return {
    overconsolidationRatio,
    consolidationState:
      overconsolidationRatio === 1
        ? "normallyConsolidated"
        : overconsolidationRatio > 1
          ? "overconsolidated"
          : "underconsolidated",
  };
};

export const overconsolidationRatioExample = {
  input: {
    preconsolidationPressureKpa: 200,
    effectiveOverburdenStressKpa: 100,
  },
  output: { overconsolidationRatio: 2, consolidationState: "overconsolidated" },
} satisfies ToolExample<
  OverconsolidationRatioInput,
  OverconsolidationRatioOutput
>;

export const overconsolidationRatioTool = createSimpleTool({
  id: "geology/overconsolidation-ratio",
  title: "Overconsolidation Ratio Calculator",
  description:
    "Overconsolidation ratio OCR = sigma_p' / sigma_v0' where sigma_p' is the maximum past effective vertical stress (preconsolidation pressure) and sigma_v0' the present effective overburden stress, both in kPa.",
  inputs: [
    {
      description: "Preconsolidation pressure sigma_p' in kPa.",
      id: "preconsolidationPressureKpa",
      kind: "number",
      label: "sigma p'",
      minimum: 0,
    },
    {
      description: "Present effective overburden stress sigma_v0' in kPa.",
      id: "effectiveOverburdenStressKpa",
      kind: "number",
      label: "sigma v0'",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "OCR, dimensionless.",
      id: "overconsolidationRatio",
      kind: "number",
      label: "OCR",
    },
    {
      description: "Stress history state implied by OCR.",
      id: "consolidationState",
      enum: ["normallyConsolidated", "overconsolidated", "underconsolidated"],
      kind: "string",
      label: "State",
    },
  ],
  calculate: (input) =>
    calculateOverconsolidationRatio(
      input as unknown as OverconsolidationRatioInput,
    ),
});

export const runOverconsolidationRatio = overconsolidationRatioTool.execute;
export default overconsolidationRatioTool;
