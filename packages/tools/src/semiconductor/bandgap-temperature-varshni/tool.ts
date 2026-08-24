import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BandgapTemperatureVarshniInput = {
  readonly alphaVarshni?: number;
  readonly betaVarshni?: number;
  readonly egZeroEv?: number;
  readonly tempK: number;
};

export type BandgapTemperatureVarshniOutput = {
  readonly bandgapEv: number;
};

export const bandgapTemperatureVarshniExample = {
  input: {
    alphaVarshni: 4.73e-4,
    betaVarshni: 636,
    egZeroEv: 1.17,
    tempK: 300,
  },
  output: { bandgapEv: 1.1245192307692307 },
} satisfies ToolExample<
  BandgapTemperatureVarshniInput,
  BandgapTemperatureVarshniOutput
>;

export const calculateBandgapTemperatureVarshni = (
  input: BandgapTemperatureVarshniInput,
): BandgapTemperatureVarshniOutput => {
  const tempK = input.tempK;
  const egZeroEv = input.egZeroEv ?? 1.17;
  const alphaVarshni = input.alphaVarshni ?? 4.73e-4;
  const betaVarshni = input.betaVarshni ?? 636;

  if (!Number.isFinite(tempK) || tempK <= 0)
    simpleError(
      "tempK",
      "Temperature must be a finite number greater than 0 K.",
      "invalid_temperature",
    );

  if (!Number.isFinite(egZeroEv) || egZeroEv <= 0)
    simpleError(
      "egZeroEv",
      "Bandgap at 0 K must be a finite positive number.",
      "invalid_egZeroEv",
    );

  if (!Number.isFinite(alphaVarshni) || alphaVarshni < 0)
    simpleError(
      "alphaVarshni",
      "Varshni alpha must be a finite number at least 0 eV/K.",
      "invalid_alphaVarshni",
    );

  if (!Number.isFinite(betaVarshni) || betaVarshni <= 0)
    simpleError(
      "betaVarshni",
      "Varshni beta must be a finite number greater than 0 K.",
      "invalid_betaVarshni",
    );

  const logTerm =
    alphaVarshni === 0
      ? Number.NEGATIVE_INFINITY
      : Math.log(alphaVarshni) +
        2 * Math.log(tempK) -
        (Math.max(Math.log(tempK), Math.log(betaVarshni)) +
          Math.log1p(
            Math.exp(-Math.abs(Math.log(tempK) - Math.log(betaVarshni))),
          ));
  const term = alphaVarshni === 0 ? 0 : Math.exp(logTerm);
  if (!Number.isFinite(term))
    simpleError("tempK", "Varshni term overflowed.", "numeric_overflow");

  const bandgapEv = egZeroEv - term;
  if (!Number.isFinite(bandgapEv))
    simpleError("tempK", "Bandgap overflowed.", "numeric_overflow");

  return { bandgapEv: bandgapEv === 0 ? 0 : bandgapEv };
};

export const bandgapTemperatureVarshniTool = createSimpleTool({
  calculate: (input) =>
    calculateBandgapTemperatureVarshni({
      alphaVarshni: (input.alphaVarshni as number | undefined) ?? undefined,
      betaVarshni: (input.betaVarshni as number | undefined) ?? undefined,
      egZeroEv: (input.egZeroEv as number | undefined) ?? undefined,
      tempK: input.tempK as number,
    }),
  description:
    "Evaluate the Varshni temperature dependence of a semiconductor bandgap: Eg(T)=Eg0 - alpha·T²/(T+beta), using a logarithmic evaluation that avoids overflowing T². The coefficients are material-specific empirical fit parameters; extrapolation beyond their fitted temperature range can produce nonphysical results.",
  id: "semiconductor/bandgap-temperature-varshni",
  inputs: [
    {
      description:
        "Lattice temperature. Must be a finite number greater than 0 K.",
      id: "tempK",
      kind: "number",
      label: "Temperature",
      minimum: Number.MIN_VALUE,
      unit: "K",
    },
    {
      default: 1.17,
      description:
        "Bandgap at 0 K. Must be a finite number greater than 0 eV; silicon default 1.17 eV.",
      id: "egZeroEv",
      kind: "number",
      label: "Bandgap at 0 K",
      minimum: Number.MIN_VALUE,
      unit: "eV",
    },
    {
      default: 4.73e-4,
      description:
        "Varshni alpha coefficient. Must be a finite number at least 0 eV/K; silicon default 4.73e-4 eV/K.",
      id: "alphaVarshni",
      kind: "number",
      label: "Varshni alpha",
      minimum: 0,
      unit: "eV/K",
    },
    {
      default: 636,
      description:
        "Varshni beta coefficient. Must be a finite number greater than 0 K; silicon default 636 K.",
      id: "betaVarshni",
      kind: "number",
      label: "Varshni beta",
      minimum: Number.MIN_VALUE,
      unit: "K",
    },
  ],
  outputs: [
    {
      description:
        "Bandgap at temperature T (eV). Finite; may be negative if T far outside fitted range.",
      id: "bandgapEv",
      kind: "number",
      label: "Bandgap",
      unit: "eV",
    },
  ],
  title: "Varshni Bandgap Calculator",
});
export const runBandgapTemperatureVarshni =
  bandgapTemperatureVarshniTool.execute;
export default bandgapTemperatureVarshniTool;
