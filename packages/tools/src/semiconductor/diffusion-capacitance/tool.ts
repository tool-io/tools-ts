import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DiffusionCapacitanceInput = {
  readonly forwardCurrentMa: number;
  readonly lifetimeNs: number;
  readonly idealityFactor?: number;
  readonly temperatureK?: number;
};

export type DiffusionCapacitanceOutput = {
  readonly capacitanceNanoF: number;
};

const BOLTZMANN_J_PER_K = 1.380649e-23;
const ELEMENTARY_CHARGE_C = 1.602176634e-19;

export const diffusionCapacitanceExample = {
  input: {
    forwardCurrentMa: 1,
    idealityFactor: 1,
    lifetimeNs: 100,
  },
  output: { capacitanceNanoF: 3.8681727071833607 },
} satisfies ToolExample<DiffusionCapacitanceInput, DiffusionCapacitanceOutput>;

export const calculateDiffusionCapacitance = (
  input: DiffusionCapacitanceInput,
): DiffusionCapacitanceOutput => {
  const forwardCurrentMa = input.forwardCurrentMa;
  const lifetimeNs = input.lifetimeNs;
  const idealityFactor = input.idealityFactor ?? 1;
  const temperatureK = input.temperatureK ?? 300;

  if (!Number.isFinite(forwardCurrentMa) || forwardCurrentMa < 0)
    simpleError(
      "forwardCurrentMa",
      "Forward current must be a finite number at least 0.",
      "invalid_current",
    );
  if (!Number.isFinite(lifetimeNs) || lifetimeNs <= 0)
    simpleError(
      "lifetimeNs",
      "Lifetime must be a finite positive number.",
      "invalid_lifetime",
    );
  if (!Number.isFinite(idealityFactor) || idealityFactor < 1)
    simpleError(
      "idealityFactor",
      "Ideality factor must be a finite number at least 1.",
      "invalid_ideality",
    );
  if (!Number.isFinite(temperatureK) || temperatureK <= 0)
    simpleError(
      "temperatureK",
      "Temperature must be a finite positive number.",
      "invalid_temperature",
    );

  const thermalVoltage =
    (BOLTZMANN_J_PER_K * temperatureK) / ELEMENTARY_CHARGE_C;
  if (!Number.isFinite(thermalVoltage) || thermalVoltage <= 0)
    simpleError(
      "temperatureK",
      "Thermal voltage could not be calculated.",
      "numeric_overflow",
    );

  if (forwardCurrentMa === 0) return { capacitanceNanoF: 0 };
  // In the declared units C[nF] = tau[ns] * I[mA] * 1e-3 / (n*Vt).
  const logCapacitanceNanoF =
    Math.log(lifetimeNs) +
    Math.log(forwardCurrentMa) +
    Math.log(1e-3) -
    Math.log(idealityFactor) -
    Math.log(thermalVoltage);
  const directCapacitanceNanoF =
    (lifetimeNs * forwardCurrentMa * 1e-3) / (idealityFactor * thermalVoltage);
  const capacitanceNanoF =
    Number.isFinite(directCapacitanceNanoF) && directCapacitanceNanoF > 0
      ? directCapacitanceNanoF
      : Math.exp(logCapacitanceNanoF);
  if (!Number.isFinite(capacitanceNanoF) || capacitanceNanoF === 0)
    simpleError(
      "lifetimeNs",
      "Diffusion capacitance is outside the representable positive range.",
      capacitanceNanoF === 0 ? "numeric_underflow" : "numeric_overflow",
    );

  return { capacitanceNanoF: capacitanceNanoF === 0 ? 0 : capacitanceNanoF };
};

export const diffusionCapacitanceTool = createSimpleTool({
  calculate: (input) =>
    calculateDiffusionCapacitance({
      forwardCurrentMa: input.forwardCurrentMa as number,
      idealityFactor: (input.idealityFactor as number | undefined) ?? undefined,
      lifetimeNs: input.lifetimeNs as number,
      temperatureK: (input.temperatureK as number | undefined) ?? undefined,
    }),
  description:
    "Compute the diffusion capacitance of a forward-biased diode from stored-charge lifetime and current. Formula: Cdiff [nF] = 1e9 · (τ [ns]·1e-9 · I [mA]·1e-3) / (n · Vt [V]), where Vt = k·T/q (k=1.380649e-23 J/K, q=1.602176634e-19 C). Equivalent: Cdiff [F] = τ·I/(n·Vt). Inputs: I ≥ 0 mA, τ > 0 ns, n ≥ 1 (default 1), T > 0 K (default 300 K). Output: Cdiff ≥ 0 nF. Assumes low-level injection, negligible depletion capacitance, and quasi-neutral stored charge τ·I.",
  id: "semiconductor/diffusion-capacitance",
  inputs: [
    {
      description:
        "Forward bias current. Must be at least 0 mA; 0 yields 0 nF.",
      id: "forwardCurrentMa",
      kind: "number",
      label: "Forward current",
      minimum: 0,
      unit: "mA",
    },
    {
      description: "Minority-carrier lifetime. Must be greater than 0 ns.",
      id: "lifetimeNs",
      kind: "number",
      label: "Lifetime",
      minimum: Number.MIN_VALUE,
      unit: "ns",
    },
    {
      default: 1,
      description: "Diode ideality factor. Must be at least 1.",
      id: "idealityFactor",
      kind: "number",
      label: "Ideality factor",
      minimum: 1,
    },
    {
      default: 300,
      description: "Device temperature. Must be greater than 0 K.",
      id: "temperatureK",
      kind: "number",
      label: "Temperature",
      minimum: Number.MIN_VALUE,
      unit: "K",
    },
  ],
  outputs: [
    {
      description: "Diffusion capacitance. At least 0 nF.",
      format: "capacitance-nf",
      id: "capacitanceNanoF",
      kind: "number",
      label: "Capacitance",
      minimum: 0,
      unit: "nF",
    },
  ],
  title: "Diffusion Capacitance Calculator",
});
export const runDiffusionCapacitance = diffusionCapacitanceTool.execute;
export default diffusionCapacitanceTool;
