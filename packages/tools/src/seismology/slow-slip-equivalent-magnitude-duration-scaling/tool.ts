import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const slowSlipEquivalentMagnitudeDurationScalingExample = {
  input: {
    areaKm2: 2000,
    durationDays: 14,
    plateRateMmYr: 35,
    slipAmplification: 10,
    rigidityGPa: 30,
  },
  output: {
    equivalentMagnitudeMw: 5.870504737203881,
    slipM: 0.0134154688569473,
    momentNm: 804928131416838000,
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const slowSlipEquivalentMagnitudeDurationScalingTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({
      areaKm2,
      durationDays,
      plateRateMmYr,
      slipAmplification,
      rigidityGPa,
    }) => {
      const amplification = slipAmplification ?? 10;
      const rigidity = rigidityGPa ?? 30;
      if (!(areaKm2 > 0) || !(durationDays > 0) || !(plateRateMmYr > 0))
        simpleError(
          "areaKm2",
          "Area, duration, and plate rate must be positive.",
        );
      if (!(amplification > 0) || !(rigidity > 0))
        simpleError(
          "slipAmplification",
          "Amplification and rigidity must be positive.",
        );
      const d =
        ((plateRateMmYr * 1e-3) / 365.25) * durationDays * amplification;
      const m0 = rigidity * 1e9 * areaKm2 * 1e6 * d;
      return {
        equivalentMagnitudeMw: (2 / 3) * (Math.log10(m0) - 9.1),
        slipM: d,
        momentNm: m0,
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Equivalent moment magnitude of a slow-slip episode from plate-rate slip accumulated over its duration.",
  id: "seismology/slow-slip-equivalent-magnitude-duration-scaling",
  inputs: [
    {
      minimum: 0,
      description: "Slip patch area.",
      id: "areaKm2",
      kind: "number",
      label: "A",
      unit: "km²",
    },
    {
      minimum: 0,
      description: "Episode duration.",
      id: "durationDays",
      kind: "number",
      label: "T",
      unit: "d",
    },
    {
      minimum: 0,
      description: "Plate convergence rate.",
      id: "plateRateMmYr",
      kind: "number",
      label: "v_pl",
      unit: "mm/yr",
    },
    {
      default: 10,
      description: "Slip amplification over plate rate.",
      id: "slipAmplification",
      kind: "number",
      label: "ξ",
    },
    {
      default: 30,
      description: "Rigidity.",
      id: "rigidityGPa",
      kind: "number",
      label: "μ",
      unit: "GPa",
    },
  ],
  outputs: [
    {
      description: "Equivalent moment magnitude.",
      id: "equivalentMagnitudeMw",
      kind: "number",
      label: "M_w",
    },
    {
      description: "Accumulated slow slip.",
      id: "slipM",
      kind: "number",
      label: "d",
      unit: "m",
    },
    {
      description: "Geodetic moment.",
      id: "momentNm",
      kind: "number",
      label: "M₀",
      unit: "N·m",
    },
  ],
  title: "Slow Slip Equivalent Magnitude Duration Scaling Calculator",
});
export const runSlowSlipEquivalentMagnitudeDurationScaling =
  slowSlipEquivalentMagnitudeDurationScalingTool.execute;
export { slowSlipEquivalentMagnitudeDurationScalingExample as example };
export default slowSlipEquivalentMagnitudeDurationScalingTool;
