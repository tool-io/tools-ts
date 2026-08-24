import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GateInducedDrainLeakageInput = {
  readonly characteristicFieldMVPerCm: number;
  readonly peakFieldMVPerCm: number;
  readonly prefactorPicoA: number;
};

export type GateInducedDrainLeakageOutput = {
  readonly gidlPicoAmperes: number;
};

export const gateInducedDrainLeakageExample = {
  input: {
    characteristicFieldMVPerCm: 400,
    peakFieldMVPerCm: 8,
    prefactorPicoA: 100,
  },
  output: { gidlPicoAmperes: 1.9287498479639178e-20 },
} satisfies ToolExample<
  GateInducedDrainLeakageInput,
  GateInducedDrainLeakageOutput
>;

export const gateInducedDrainLeakageTool = createSimpleTool({
  calculate: (input) => {
    const characteristicFieldMVPerCm =
      input.characteristicFieldMVPerCm as number;
    const peakFieldMVPerCm = input.peakFieldMVPerCm as number;
    const prefactorPicoA = input.prefactorPicoA as number;
    const characteristicField = characteristicFieldMVPerCm;
    if (!(peakFieldMVPerCm > 0))
      simpleError(
        "peakFieldMVPerCm",
        "Peak drain field must be positive.",
        "invalid_peak_field",
      );
    if (!(characteristicField > 0))
      simpleError(
        "characteristicFieldMVPerCm",
        "Characteristic field must be positive.",
        "invalid_characteristic_field",
      );
    if (!(prefactorPicoA > 0))
      simpleError(
        "prefactorPicoA",
        "Calibrated current prefactor must be positive.",
        "invalid_prefactor",
      );
    const gidlPicoAmperes =
      prefactorPicoA * Math.exp(-characteristicField / peakFieldMVPerCm);
    if (gidlPicoAmperes === 0)
      simpleError(
        "peakFieldMVPerCm",
        "The leakage current is too small to represent.",
        "numeric_underflow",
      );
    return {
      gidlPicoAmperes,
    };
  },
  description:
    "Evaluate a calibrated gate-induced drain-leakage exponential from peak field, characteristic field, and current prefactor.",
  id: "semiconductor/gate-induced-drain-leakage",
  inputs: [
    {
      description:
        "Characteristic field obtained from a process-specific GIDL fit.",
      id: "characteristicFieldMVPerCm",
      kind: "number",
      label: "Characteristic field",
      minimum: Number.MIN_VALUE,
      unit: "MV/cm",
    },
    {
      description: "Peak electric field at the drain junction.",
      format: "electric-field-mv-per-cm",
      id: "peakFieldMVPerCm",
      kind: "number",
      label: "Peak drain field",
      minimum: Number.MIN_VALUE,
      unit: "MV/cm",
    },
    {
      description: "Current prefactor from the same calibrated GIDL fit.",
      id: "prefactorPicoA",
      kind: "number",
      label: "GIDL prefactor",
      minimum: Number.MIN_VALUE,
      unit: "pA",
    },
  ],
  outputs: [
    {
      description: "Gate-induced drain leakage current.",
      format: "current-pa",
      id: "gidlPicoAmperes",
      kind: "number",
      label: "GIDL current",
      minimum: Number.MIN_VALUE,
      unit: "pA",
    },
  ],
  title: "GIDL Current Calculator",
});
export const runGateInducedDrainLeakage = gateInducedDrainLeakageTool.execute;
export default gateInducedDrainLeakageTool;
