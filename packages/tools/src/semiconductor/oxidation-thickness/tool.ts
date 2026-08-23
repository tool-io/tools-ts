import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type OxideThicknessInput = {
  readonly parabolicRateConstantNm2PerHour: number;
  readonly oxidationTimeHours: number;
};

export type OxideThicknessOutput = {
  readonly oxideThicknessNm: number;
};

export const oxideThicknessExample = {
  input: { parabolicRateConstantNm2PerHour: 0.5, oxidationTimeHours: 2 },
  output: { oxideThicknessNm: 1 },
} satisfies ToolExample<OxideThicknessInput, OxideThicknessOutput>;

export const calculateOxideThickness = (
  input: OxideThicknessInput,
): OxideThicknessOutput => {
  const b = input.parabolicRateConstantNm2PerHour;
  const t = input.oxidationTimeHours;
  if (!Number.isFinite(b) || b <= 0)
    simpleError(
      "parabolicRateConstantNm2PerHour",
      "Parabolic rate constant B must be a finite positive number.",
      "invalid_b",
    );
  if (!Number.isFinite(t) || t < 0)
    simpleError(
      "oxidationTimeHours",
      "Oxidation time must be a finite number at least 0.",
      "invalid_time",
    );
  // sqrt(B) * sqrt(t) remains finite whenever the mathematical result does,
  // even if the intermediate product B*t would overflow.
  const oxideThicknessNm = Math.sqrt(b) * Math.sqrt(t);
  if (!Number.isFinite(oxideThicknessNm) || (t > 0 && oxideThicknessNm === 0))
    simpleError(
      "oxidationTimeHours",
      "Oxide thickness is outside the finite numeric range.",
      "numeric_range",
    );
  return {
    oxideThicknessNm: oxideThicknessNm === 0 ? 0 : oxideThicknessNm,
  };
};

export const oxideThicknessTool = createSimpleTool({
  calculate: (input) =>
    calculateOxideThickness({
      oxidationTimeHours: input.oxidationTimeHours as number,
      parabolicRateConstantNm2PerHour:
        input.parabolicRateConstantNm2PerHour as number,
    }),
  description:
    "Compute diffusion-limited thermal oxide thickness in the parabolic regime as sqrt(B·t).",
  id: "semiconductor/oxidation-thickness",
  inputs: [
    {
      description:
        "Parabolic rate constant B at the oxidation temperature. Must be greater than 0 nm²/hour.",
      id: "parabolicRateConstantNm2PerHour",
      kind: "number",
      label: "Parabolic rate constant B",
      minimum: Number.MIN_VALUE,
      unit: "nm^2/hour",
    },
    {
      description:
        "Duration of the thermal oxidation. Must be at least 0 hour; 0 yields 0 nm.",
      id: "oxidationTimeHours",
      kind: "number",
      label: "Oxidation time",
      minimum: 0,
      unit: "hour",
    },
  ],
  outputs: [
    {
      description: "Diffusion-limited oxide thickness in the parabolic regime.",
      id: "oxideThicknessNm",
      kind: "number",
      label: "Oxide thickness",
      minimum: 0,
      unit: "nm",
    },
  ],
  title: "Parabolic Oxide Thickness Calculator",
});
export const runOxideThickness = oxideThicknessTool.execute;
export default oxideThicknessTool;
