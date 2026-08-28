import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const realGasCorrectionATool = createSimpleTool({
  id: "chemistry/real-gas-correction-a",
  title: "Real Gas Correction A Calculator",
  description: "Compute van der Waals pressure correction term a(n/V)^2.",
  inputs: [
    {
      id: "aAtmL2PerMol2",
      label: "a constant",
      kind: "number",
      minimum: 0,
      unit: "atm*L2/mol2",
    },
    { id: "moles", label: "Moles", kind: "number", minimum: 0 },
    { id: "volumeL", label: "Volume", kind: "number", minimum: 0, unit: "L" },
  ],
  outputs: [
    {
      id: "correctionPressureAtm",
      label: "Correction pressure",
      kind: "number",
      unit: "atm",
    },
  ],
  calculate: (input) => {
    const volume = input.volumeL as number;
    if (!(volume > 0))
      simpleError("volumeL", "Volume must be greater than zero.");
    return {
      correctionPressureAtm:
        (input.aAtmL2PerMol2 as number) *
        ((input.moles as number) / volume) ** 2,
    };
  },
});
export default realGasCorrectionATool;
export const runRealGasCorrectionA = realGasCorrectionATool.execute;

export type RealGasCorrectionAInput = {
  readonly aAtmL2PerMol2: number;
  readonly moles: number;
  readonly volumeL: number;
};

export type RealGasCorrectionAOutput = {
  readonly correctionPressureAtm: number;
};

export const realGasCorrectionAExample = {
  input: {
    aAtmL2PerMol2: 1,
    moles: 1,
    volumeL: 1,
  },
  output: {
    correctionPressureAtm: 1,
  },
} satisfies ToolExample<RealGasCorrectionAInput, RealGasCorrectionAOutput>;
