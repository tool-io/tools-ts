import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CoilEfficiencyInput = {
  readonly singletOxygenExcitationPowerW: number;
  readonly laserOutputPowerW: number;
};

export type CoilEfficiencyOutput = {
  readonly opticalConversionEfficiencyPercent: number;
  readonly quantumLimitPercent: number;
  readonly note: string;
};

/**
 * Quantum cap from the O2(¹Δ) 1270 nm donor quantum to the 1315.27 nm
 * iodine photon: η_q = 1270/1315.27 ≈ 96.6%. Measured chemical
 * efficiencies sit far below this photon-energy ceiling.
 */
export const COIL_QUANTUM_LIMIT_PERCENT = (1270 / 1315.27) * 100;

export const coilEfficiency = (
  input: CoilEfficiencyInput,
): CoilEfficiencyOutput => {
  const { singletOxygenExcitationPowerW, laserOutputPowerW } = input;
  if (
    !Number.isFinite(singletOxygenExcitationPowerW) ||
    singletOxygenExcitationPowerW <= 0
  )
    simpleError(
      "singletOxygenExcitationPowerW",
      "Singlet-oxygen excitation power must be positive.",
    );
  if (!Number.isFinite(laserOutputPowerW) || laserOutputPowerW < 0)
    simpleError(
      "laserOutputPowerW",
      "Laser output power must not be negative.",
    );
  if (laserOutputPowerW > singletOxygenExcitationPowerW)
    simpleError(
      "laserOutputPowerW",
      "Laser power cannot exceed the supplied excitation power.",
    );
  const opticalConversionEfficiencyPercent =
    (laserOutputPowerW / singletOxygenExcitationPowerW) * 100;
  if (!Number.isFinite(opticalConversionEfficiencyPercent))
    simpleError("laserOutputPowerW", "Efficiency overflowed.");
  return {
    opticalConversionEfficiencyPercent,
    quantumLimitPercent: COIL_QUANTUM_LIMIT_PERCENT,
    note: "The 1270/1315.27 ratio is a photon-energy ceiling for converting supplied O2(¹Δ) excitation power into 1315.27 nm light; it is not a wall-plug or total chemical efficiency.",
  };
};

export const coilEfficiencyExample = {
  input: { singletOxygenExcitationPowerW: 1000, laserOutputPowerW: 150 },
  output: {
    opticalConversionEfficiencyPercent: 15,
    quantumLimitPercent: 96.55812114622854,
    note: "The 1270/1315.27 ratio is a photon-energy ceiling for converting supplied O2(¹Δ) excitation power into 1315.27 nm light; it is not a wall-plug or total chemical efficiency.",
  },
} satisfies ToolExample<CoilEfficiencyInput, CoilEfficiencyOutput>;

export const coilEfficiencyTool = createSimpleTool({
  calculate: (input) =>
    coilEfficiency({
      singletOxygenExcitationPowerW:
        input.singletOxygenExcitationPowerW as number,
      laserOutputPowerW: input.laserOutputPowerW as number,
    }),
  description:
    "Compute chemical oxygen–iodine laser energy-transfer efficiency from donor chemical power and 1315 nm output power with the photon-energy quantum cap.",
  id: "laser/laser-chemical-oxygen-iodine-energy-transfer-efficiency-lookup",
  inputs: [
    {
      description: "Excitation power carried by the O2(¹Δ) donor state.",
      id: "singletOxygenExcitationPowerW",
      kind: "number",
      label: "Donor power",
      minimum: Number.MIN_VALUE,
      unit: "W",
    },
    {
      description: "Measured 1315 nm laser output power.",
      id: "laserOutputPowerW",
      kind: "number",
      label: "Laser power",
      minimum: 0,
      unit: "W",
    },
  ],
  outputs: [
    {
      description: "Laser over donor power as a percentage.",
      id: "opticalConversionEfficiencyPercent",
      kind: "number",
      label: "Efficiency",
      unit: "%",
    },
    {
      description: "Photon-energy ceiling 1270/1315.27 as a percentage.",
      id: "quantumLimitPercent",
      kind: "number",
      label: "Quantum cap",
      unit: "%",
    },
    {
      description: "Interpretation of the efficiency gap.",
      id: "note",
      kind: "string",
      label: "Note",
    },
  ],
  title: "COIL Transfer Efficiency",
});
export const runCoilEfficiency = coilEfficiencyTool.execute;
export default coilEfficiencyTool;

export { coilEfficiencyExample as example };
