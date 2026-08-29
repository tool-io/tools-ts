import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const faultSeismicMomentDeficitCalculatorExample = {
  input: {
    momentsNm: [8000000000000000000],
    areaKm2: 2000,
    slipRateMmYr: 10,
    rigidityGPa: 30,
    windowYears: 100,
  },
  output: {
    budgetMomentNm: 60000000000000000000,
    capturedPercent: 13.333333333333334,
    deficitNote: "large aseismic or pre-window deficit",
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const faultSeismicMomentDeficitCalculatorTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ momentsNm, areaKm2, slipRateMmYr, rigidityGPa, windowYears }) => {
      const xs = momentsNm as unknown[];
      if (!Array.isArray(xs) || (xs as number[]).some((value) => value < 0))
        simpleError("momentsNm", "Provide a list of nonnegative moments.");
      if (
        !(areaKm2 > 0) ||
        !(slipRateMmYr > 0) ||
        !(windowYears > 0) ||
        !((rigidityGPa ?? 30) > 0)
      )
        simpleError(
          "areaKm2",
          "Area, slip rate, rigidity, and window must be positive.",
        );
      const budget =
        (rigidityGPa ?? 30) *
        1e9 *
        areaKm2 *
        1e6 *
        (slipRateMmYr * 1e-3) *
        windowYears;
      const captured = (xs as number[]).reduce((a, b) => a + b, 0);
      const pct = (captured / budget) * 100;
      return {
        budgetMomentNm: budget,
        capturedPercent: pct,
        deficitNote:
          pct < 50
            ? "large aseismic or pre-window deficit"
            : pct <= 110
              ? "roughly balanced release"
              : "over-release vs assumed budget",
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Compare seismic moment captured over a window against the tectonic budget μ·A·V·T.",
  id: "seismology/fault-seismic-moment-deficit-calculator",
  inputs: [
    {
      description: "Seismic moments on the fault.",
      id: "momentsNm",
      kind: "numberList",
      label: "M₀ᵢ",
    },
    {
      minimum: 0,
      description: "Fault rupture area.",
      id: "areaKm2",
      kind: "number",
      label: "A",
      unit: "km²",
    },
    {
      minimum: 0,
      description: "Long-term slip rate.",
      id: "slipRateMmYr",
      kind: "number",
      label: "V",
      unit: "mm/yr",
    },
    {
      default: 30,
      description: "Rigidity.",
      id: "rigidityGPa",
      kind: "number",
      label: "μ",
      unit: "GPa",
    },
    {
      minimum: 0,
      description: "Observation window.",
      id: "windowYears",
      kind: "number",
      label: "T",
      unit: "yr",
    },
  ],
  outputs: [
    {
      description: "Tectonic moment budget.",
      id: "budgetMomentNm",
      kind: "number",
      label: "Budget",
      unit: "N·m",
    },
    {
      description: "Seismic share of the budget.",
      id: "capturedPercent",
      kind: "number",
      label: "%",
      unit: "%",
    },
    {
      description: "Deficit interpretation.",
      id: "deficitNote",
      kind: "string",
      label: "Note",
    },
  ],
  title: "Fault Seismic Moment Deficit Calculator",
});
export const runFaultSeismicMomentDeficitCalculator =
  faultSeismicMomentDeficitCalculatorTool.execute;
export { faultSeismicMomentDeficitCalculatorExample as example };
export default faultSeismicMomentDeficitCalculatorTool;
