import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CorePermeabilityKlinkenbergCorrectedInput = {
  readonly gasPermeabilityMd: number;
  readonly slippageFactorKpa: number;
  readonly meanPorePressureKpa: number;
};

export type CorePermeabilityKlinkenbergCorrectedOutput = {
  readonly klinkenbergPermeabilityMd: number;
  readonly slipCorrectionFactor: number;
};

export const calculateCorePermeabilityKlinkenbergCorrected = (
  input: CorePermeabilityKlinkenbergCorrectedInput,
): CorePermeabilityKlinkenbergCorrectedOutput => {
  if (!(input.gasPermeabilityMd > 0))
    simpleError(
      "gasPermeabilityMd",
      "Gas permeability must be positive.",
      "invalid_permeability",
    );
  if (!(input.slippageFactorKpa >= 0))
    simpleError(
      "slippageFactorKpa",
      "Slippage factor must be non-negative.",
      "invalid_slippage",
    );
  if (!(input.meanPorePressureKpa > 0))
    simpleError(
      "meanPorePressureKpa",
      "Mean pore pressure must be positive.",
      "invalid_pressure",
    );
  const slipCorrectionFactor =
    1 + input.slippageFactorKpa / input.meanPorePressureKpa;
  return {
    klinkenbergPermeabilityMd: input.gasPermeabilityMd / slipCorrectionFactor,
    slipCorrectionFactor,
  };
};

export const corePermeabilityKlinkenbergCorrectedExample = {
  input: {
    gasPermeabilityMd: 100,
    slippageFactorKpa: 10,
    meanPorePressureKpa: 200,
  },
  output: {
    klinkenbergPermeabilityMd: 95.23809523809524,
    slipCorrectionFactor: 1.05,
  },
} satisfies ToolExample<
  CorePermeabilityKlinkenbergCorrectedInput,
  CorePermeabilityKlinkenbergCorrectedOutput
>;

export const corePermeabilityKlinkenbergCorrectedTool = createSimpleTool({
  id: "geology/core-permeability-klinkenberg-corrected",
  title: "Core Permeability Klinkenberg Corrected Calculator",
  description:
    "Apply the Klinkenberg gas-slippage correction kL = kg / (1 + b/Pm) to a steady-state core gas measurement.",
  inputs: [
    {
      description: "Measured gas permeability in millidarcies.",
      id: "gasPermeabilityMd",
      kind: "number",
      label: "kg",
    },
    {
      description: "Klinkenberg slippage factor b in kilopascals.",
      id: "slippageFactorKpa",
      kind: "number",
      label: "b",
    },
    {
      description: "Mean pore pressure in kilopascals.",
      id: "meanPorePressureKpa",
      kind: "number",
      label: "Pm",
    },
  ],
  outputs: [
    {
      description:
        "Klinkenberg-corrected liquid-equivalent permeability in millidarcies.",
      id: "klinkenbergPermeabilityMd",
      kind: "number",
      label: "kL",
    },
    {
      description: "Dimensionless slip correction factor 1 + b/Pm.",
      id: "slipCorrectionFactor",
      kind: "number",
      label: "Correction",
    },
  ],
  calculate: (input) =>
    calculateCorePermeabilityKlinkenbergCorrected(
      input as unknown as CorePermeabilityKlinkenbergCorrectedInput,
    ),
});

export const runCorePermeabilityKlinkenbergCorrected =
  corePermeabilityKlinkenbergCorrectedTool.execute;
export default corePermeabilityKlinkenbergCorrectedTool;
