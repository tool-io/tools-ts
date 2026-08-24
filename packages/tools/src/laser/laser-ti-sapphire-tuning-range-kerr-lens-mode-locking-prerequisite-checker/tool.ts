import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type KlmPrerequisiteInput = {
  readonly lambdaNm?: number;
  readonly n0?: number;
  readonly n2SqCmPerW?: number;
  readonly availablePeakPowerKw?: number;
};

export type KlmPrerequisiteOutput = {
  readonly criticalPowerW: number;
  readonly modeLockingFeasible: boolean;
  readonly marginFactor: number;
  readonly tuningRangeNote: string;
};

const TUNING_RANGE_NOTE =
  "Common Ti:sapphire mirror sets: standard 720–1020 nm, broadband 650–1100 nm, transform-limited 730–850 nm.";

/** Critical power for Kerr self-focusing: P_cr = 3.77 λ² / (8 π n0 n2). */
export const kerrCriticalPowerW = (
  lambdaNm: number,
  n0: number,
  n2SqCmPerW: number,
): number => {
  const lambdaCm = lambdaNm * 1e-7;
  return (3.77 * lambdaCm * lambdaCm) / (8 * Math.PI * n0 * n2SqCmPerW);
};

export const computeKlmPrerequisite = (
  input: KlmPrerequisiteInput,
): KlmPrerequisiteOutput => {
  const lambdaNm = input.lambdaNm ?? 800;
  const n0 = input.n0 ?? 1.76;
  const n2 = input.n2SqCmPerW ?? 3e-16;
  const availablePeakPowerKw = input.availablePeakPowerKw ?? 2500;
  if (lambdaNm <= 0 || n0 <= 0 || n2 <= 0)
    simpleError(
      "lambdaNm",
      "Wavelength and refractive indices must be positive.",
    );
  if (availablePeakPowerKw < 0)
    simpleError(
      "availablePeakPowerKw",
      "Available peak power cannot be negative.",
    );
  const criticalPowerW = kerrCriticalPowerW(lambdaNm, n0, n2);
  const peakPowerW = availablePeakPowerKw * 1000;
  return {
    criticalPowerW,
    modeLockingFeasible: peakPowerW >= criticalPowerW,
    marginFactor: peakPowerW / criticalPowerW,
    tuningRangeNote: TUNING_RANGE_NOTE,
  };
};

export const klmPrerequisiteExample = {
  input: { availablePeakPowerKw: 2500 },
  output: computeKlmPrerequisite({ availablePeakPowerKw: 2500 }),
} satisfies ToolExample<KlmPrerequisiteInput, KlmPrerequisiteOutput>;

export const klmPrerequisiteTool = createSimpleTool({
  calculate: (input) =>
    computeKlmPrerequisite({
      availablePeakPowerKw: input.availablePeakPowerKw as number,
      lambdaNm: input.lambdaNm as number,
      n0: input.n0 as number,
      n2SqCmPerW: input.n2SqCmPerW as number,
    }),
  description:
    "Check whether the intracavity peak power clears the Kerr self-focusing critical power that Ti:sapphire KLM mode locking requires.",
  id: "laser/laser-ti-sapphire-tuning-range-kerr-lens-mode-locking-prerequisite-checker",
  inputs: [
    {
      default: 800,
      description: "Centre wavelength of the Ti:sapphire gain band.",
      id: "lambdaNm",
      kind: "number",
      label: "Wavelength",
      minimum: 0,
      unit: "nm",
    },
    {
      default: 1.76,
      description: "Refractive index of Ti:sapphire.",
      id: "n0",
      kind: "number",
      label: "n0",
      minimum: 0,
    },
    {
      description: "Nonlinear refractive index.",
      default: 3e-16,
      id: "n2SqCmPerW",
      kind: "number",
      label: "n2",
      minimum: 0,
      unit: "cm²/W",
    },
    {
      description: "Peak power available inside the resonator.",
      default: 2500,
      id: "availablePeakPowerKw",
      kind: "number",
      label: "Available peak power",
      minimum: 0,
      unit: "kW",
    },
  ],
  outputs: [
    {
      description: "Critical power for self-focusing.",
      id: "criticalPowerW",
      kind: "number",
      label: "P_cr",
      unit: "W",
    },
    {
      description: "Whether Kerr-lens mode locking can start and hold.",
      id: "modeLockingFeasible",
      kind: "boolean",
      label: "KLM feasible",
    },
    {
      description: "Ratio of available to critical peak power.",
      id: "marginFactor",
      kind: "number",
      label: "Margin factor",
    },
    {
      description: "Typical mirror-set tuning ranges for reference.",
      id: "tuningRangeNote",
      kind: "string",
      label: "Tuning ranges",
    },
  ],
  title: "Ti:Sapphire KLM Prerequisite Check",
});
export const runKlmPrerequisite = klmPrerequisiteTool.execute;
export default klmPrerequisiteTool;

export { klmPrerequisiteExample as example };
