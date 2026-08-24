import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FlashThresholdVoltageShiftInput = {
  readonly effectiveCapacitanceFemtoFarads: number;
  readonly trappedElectronCount: number;
};

export type FlashThresholdVoltageShiftOutput = {
  readonly thresholdShiftMagnitudeVolts: number;
};

const ELEMENTARY_CHARGE_C = 1.602176634e-19;

export const flashThresholdVoltageShiftExample = {
  input: { effectiveCapacitanceFemtoFarads: 10, trappedElectronCount: 1000 },
  output: { thresholdShiftMagnitudeVolts: 0.016021766339999997 },
} satisfies ToolExample<
  FlashThresholdVoltageShiftInput,
  FlashThresholdVoltageShiftOutput
>;

export const calculateFlashThresholdVoltageShift = (
  input: FlashThresholdVoltageShiftInput,
): FlashThresholdVoltageShiftOutput => {
  if (
    !Number.isSafeInteger(input.trappedElectronCount) ||
    input.trappedElectronCount < 0
  )
    simpleError(
      "trappedElectronCount",
      "Trapped electron count must be a non-negative safe integer.",
    );
  if (
    !Number.isFinite(input.effectiveCapacitanceFemtoFarads) ||
    input.effectiveCapacitanceFemtoFarads <= 0
  )
    simpleError(
      "effectiveCapacitanceFemtoFarads",
      "Effective capacitance must be finite and greater than zero.",
    );
  const thresholdShiftMagnitudeVolts =
    (input.trappedElectronCount * ELEMENTARY_CHARGE_C) /
    (input.effectiveCapacitanceFemtoFarads * 1e-15);
  if (!Number.isFinite(thresholdShiftMagnitudeVolts))
    simpleError(
      "effectiveCapacitanceFemtoFarads",
      "The threshold shift is too large to represent.",
      "numeric_overflow",
    );
  return { thresholdShiftMagnitudeVolts };
};

export const flashThresholdVoltageShiftTool = createSimpleTool({
  id: "semiconductor/flash-threshold-voltage-shift",
  title: "Flash Threshold Voltage Shift Calculator",
  description:
    "Calculate the magnitude of a flash-cell threshold shift from trapped electron count and effective charge-storage capacitance.",
  inputs: [
    {
      description: "Electrons trapped on the floating gate.",
      id: "trappedElectronCount",
      kind: "integer",
      label: "Trapped electrons",
      minimum: 0,
    },
    {
      description:
        "Effective capacitance coupling the stored charge to threshold voltage.",
      id: "effectiveCapacitanceFemtoFarads",
      kind: "number",
      label: "Effective capacitance",
      minimum: Number.MIN_VALUE,
      unit: "fF",
    },
  ],
  outputs: [
    {
      description:
        "Magnitude qN/C of the threshold change; sign depends on the device convention.",
      id: "thresholdShiftMagnitudeVolts",
      kind: "number",
      label: "Threshold shift",
      unit: "V",
    },
  ],
  calculate: (input) =>
    calculateFlashThresholdVoltageShift({
      effectiveCapacitanceFemtoFarads:
        input.effectiveCapacitanceFemtoFarads as number,
      trappedElectronCount: input.trappedElectronCount as number,
    }),
});
export const runFlashThresholdVoltageShift =
  flashThresholdVoltageShiftTool.execute;
export default flashThresholdVoltageShiftTool;
