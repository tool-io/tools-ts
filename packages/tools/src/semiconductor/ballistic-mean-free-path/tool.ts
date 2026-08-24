import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BallisticMeanFreePathInput = {
  readonly mobilityCm2PerVs: number;
};

export type BallisticMeanFreePathOutput = {
  readonly meanFreePathNm: number;
};

const THERMAL_VOLTAGE_V = 0.02585;
const SATURATION_VELOCITY_CM_PER_S = 1e7;

export const ballisticMeanFreePathExample = {
  input: { mobilityCm2PerVs: 1400 },
  output: { meanFreePathNm: 36.190000000000005 },
} satisfies ToolExample<
  BallisticMeanFreePathInput,
  BallisticMeanFreePathOutput
>;

export const calculateBallisticMeanFreePath = (
  input: BallisticMeanFreePathInput,
): BallisticMeanFreePathOutput => {
  const mobilityCm2PerVs = input.mobilityCm2PerVs;

  if (!Number.isFinite(mobilityCm2PerVs) || mobilityCm2PerVs <= 0)
    simpleError(
      "mobilityCm2PerVs",
      "Mobility must be a finite positive number.",
      "invalid_mobility",
    );

  const meanFreePathNm =
    ((mobilityCm2PerVs * THERMAL_VOLTAGE_V) / SATURATION_VELOCITY_CM_PER_S) *
    1e7;

  if (!Number.isFinite(meanFreePathNm))
    simpleError(
      "mobilityCm2PerVs",
      "Mean free path could not be calculated due to numeric overflow.",
      "numeric_overflow",
    );
  if (meanFreePathNm === 0)
    simpleError(
      "mobilityCm2PerVs",
      "Mean free path is positive but too small to represent.",
      "numeric_underflow",
    );

  return {
    meanFreePathNm: meanFreePathNm === 0 ? 0 : meanFreePathNm,
  };
};

export const ballisticMeanFreePathTool = createSimpleTool({
  calculate: (input) =>
    calculateBallisticMeanFreePath({
      mobilityCm2PerVs: input.mobilityCm2PerVs as number,
    }),
  description:
    "Estimate the ballistic mean free path from low-field mobility using λ = (μ·Vt/vsat)·1e7 with thermal voltage Vt=0.02585 V (300 K) and saturation velocity vsat=1e7 cm/s (λ[nm]=μ·0.02585). Input mobility μ>0 cm²/V·s must be the low-field, non-degenerate value; rpm vs linear-velocity and per-area vs total distinctions do not apply. Model assumes Maxwell-Boltzmann statistics and constant vsat, valid only near 300 K as a quasi-ballistic estimate.",
  id: "semiconductor/ballistic-mean-free-path",
  inputs: [
    {
      description:
        "Low-field carrier mobility. Must be greater than 0 cm²/V·s (magnitude only; signed mobility not supported).",
      format: "mobility",
      id: "mobilityCm2PerVs",
      kind: "number",
      label: "Mobility",
      minimum: Number.MIN_VALUE,
      unit: "cm^2/Vs",
    },
  ],
  outputs: [
    {
      description: "Ballistic mean free path (magnitude). At least 0 nm.",
      format: "length",
      id: "meanFreePathNm",
      kind: "number",
      label: "Mean free path",
      minimum: 0,
      unit: "nm",
    },
  ],
  title: "Ballistic Mean Free Path Calculator",
});
export const runBallisticMeanFreePath = ballisticMeanFreePathTool.execute;
export default ballisticMeanFreePathTool;
