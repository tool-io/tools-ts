import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PreconsolidationPressureInput = {
  readonly overconsolidationRatio: number;
  readonly effectiveOverburdenStressKpa: number;
};

export type PreconsolidationPressureOutput = {
  readonly preconsolidationPressureKpa: number;
};

export const calculatePreconsolidationPressure = (
  input: PreconsolidationPressureInput,
): PreconsolidationPressureOutput => {
  if (!(input.overconsolidationRatio > 0))
    simpleError(
      "overconsolidationRatio",
      "OCR must be greater than zero.",
      "invalid_ratio",
    );
  if (!(input.effectiveOverburdenStressKpa > 0))
    simpleError(
      "effectiveOverburdenStressKpa",
      "Effective overburden stress must be greater than zero.",
      "invalid_stress",
    );
  return {
    preconsolidationPressureKpa:
      input.overconsolidationRatio * input.effectiveOverburdenStressKpa,
  };
};

export const preconsolidationPressureExample = {
  input: { overconsolidationRatio: 3, effectiveOverburdenStressKpa: 100 },
  output: { preconsolidationPressureKpa: 300 },
} satisfies ToolExample<
  PreconsolidationPressureInput,
  PreconsolidationPressureOutput
>;

export const preconsolidationPressureTool = createSimpleTool({
  id: "geology/preconsolidation-pressure",
  title: "Preconsolidation Pressure Calculator",
  description:
    "Maximum past effective vertical stress sigma_p' = OCR * sigma_v0' from the definition of the overconsolidation ratio. Stresses in kPa; use a Casagrande construction on the oedometer curve for direct measurement.",
  inputs: [
    {
      description: "Overconsolidation ratio OCR, dimensionless.",
      id: "overconsolidationRatio",
      kind: "number",
      label: "OCR",
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
      description: "Preconsolidation pressure sigma_p' in kPa.",
      id: "preconsolidationPressureKpa",
      kind: "number",
      label: "sigma p'",
    },
  ],
  calculate: (input) =>
    calculatePreconsolidationPressure(
      input as unknown as PreconsolidationPressureInput,
    ),
});

export const runPreconsolidationPressure = preconsolidationPressureTool.execute;
export default preconsolidationPressureTool;
