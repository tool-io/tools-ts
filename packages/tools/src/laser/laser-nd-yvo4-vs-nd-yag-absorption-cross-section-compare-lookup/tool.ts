import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AbsorptionCompareInput = {
  readonly yvo4DopingAtPercent?: number;
  readonly yagDopingAtPercent?: number;
};

export type AbsorptionCompareOutput = {
  readonly absorptionCoefficientYvo4PerCm: number;
  readonly absorptionCoefficientYagPerCm: number;
  readonly ratioYvo4ToYag: number;
  readonly advantageSummary: string;
};

export const N_PER_AT_PERCENT_CM3 = { yvo4: 1.26e20, yag: 1.38e20 };
export const SIGMA_ABS_808_CM2 = { yvo4: 2.7e-19, yag: 7.9e-20 };

const absorptionCoefficient = (
  dopingAtPercent: number,
  host: "yvo4" | "yag",
): number => {
  if (dopingAtPercent <= 0)
    simpleError("yvo4DopingAtPercent", "Doping must be positive.");
  return dopingAtPercent * N_PER_AT_PERCENT_CM3[host] * SIGMA_ABS_808_CM2[host];
};

export const compareAbsorptionCoefficients = (
  input: AbsorptionCompareInput,
): AbsorptionCompareOutput => {
  const alphaYvo4 = absorptionCoefficient(
    input.yvo4DopingAtPercent ?? 1,
    "yvo4",
  );
  const alphaYag = absorptionCoefficient(input.yagDopingAtPercent ?? 1, "yag");
  return {
    absorptionCoefficientYvo4PerCm: alphaYvo4,
    absorptionCoefficientYagPerCm: alphaYag,
    ratioYvo4ToYag: alphaYvo4 / alphaYag,
    advantageSummary:
      "Nd:YVO₄ absorbs ≈3× stronger with a ~10× wider pump bandwidth (tolerant of diode drift), while Nd:YAG conducts heat ~2.6× better for high-power CW.",
  };
};

export const ndYvo4NdYagAbsorptionCompareExample = {
  input: {},
  output: {
    absorptionCoefficientYvo4PerCm: 1 * 1.26e20 * 2.7e-19,
    absorptionCoefficientYagPerCm: 1 * 1.38e20 * 7.9e-20,
    ratioYvo4ToYag: (1.26e20 * 2.7e-19) / (1.38e20 * 7.9e-20),
    advantageSummary:
      "Nd:YVO₄ absorbs ≈3× stronger with a ~10× wider pump bandwidth (tolerant of diode drift), while Nd:YAG conducts heat ~2.6× better for high-power CW.",
  },
} satisfies ToolExample<AbsorptionCompareInput, AbsorptionCompareOutput>;

export const ndYvo4NdYagAbsorptionCompareTool = createSimpleTool({
  calculate: (input) =>
    compareAbsorptionCoefficients({
      yagDopingAtPercent: input.yagDopingAtPercent as number,
      yvo4DopingAtPercent: input.yvo4DopingAtPercent as number,
    }),
  description:
    "Compare the 808 nm pump absorption coefficients of Nd-doped YVO₄ and YAG for equal at.% dopings, including bandwidth trade-offs.",
  id: "laser/laser-nd-yvo4-vs-nd-yag-absorption-cross-section-compare-lookup",
  inputs: [
    {
      default: 1,
      description: "Neodymium doping of the vanadate crystal.",
      id: "yvo4DopingAtPercent",
      kind: "number",
      label: "Nd:YVO₄ doping",
      maximum: 5,
      minimum: 0,
      unit: "at.%",
    },
    {
      default: 1,
      description: "Neodymium doping of the YAG crystal.",
      id: "yagDopingAtPercent",
      kind: "number",
      label: "Nd:YAG doping",
      maximum: 5,
      minimum: 0,
      unit: "at.%",
    },
  ],
  outputs: [
    {
      description: "Pump absorption coefficient of Nd:YVO₄ (π polarization).",
      id: "absorptionCoefficientYvo4PerCm",
      kind: "number",
      label: "α_YVO₄",
      unit: "cm⁻¹",
    },
    {
      description: "Pump absorption coefficient of Nd:YAG.",
      id: "absorptionCoefficientYagPerCm",
      kind: "number",
      label: "α_YAG",
      unit: "cm⁻¹",
    },
    {
      description: "How many times stronger the vanadate absorbs.",
      id: "ratioYvo4ToYag",
      kind: "number",
      label: "Ratio",
    },
    {
      description: "Practical advantage summary of the two hosts.",
      id: "advantageSummary",
      kind: "string",
      label: "Advantage summary",
    },
  ],
  title: "Nd:YVO₄ vs Nd:YAG Pump Absorption Compare",
});
export const runNdYvo4NdYagAbsorptionCompare =
  ndYvo4NdYagAbsorptionCompareTool.execute;
export default ndYvo4NdYagAbsorptionCompareTool;

export { ndYvo4NdYagAbsorptionCompareExample as example };
