import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CvdDepositionRateInput = {
  readonly depositionTimeMinutes: number;
  readonly depositedThicknessNm: number;
};

export type CvdDepositionRateOutput = {
  readonly rateNmPerMinute: number;
};

export const cvdDepositionRateExample = {
  input: { depositionTimeMinutes: 25, depositedThicknessNm: 500 },
  output: { rateNmPerMinute: 20 },
} satisfies ToolExample<CvdDepositionRateInput, CvdDepositionRateOutput>;

export const calculateCvdDepositionRate = (
  input: CvdDepositionRateInput,
): CvdDepositionRateOutput => {
  if (
    !Number.isFinite(input.depositedThicknessNm) ||
    input.depositedThicknessNm < 0
  )
    simpleError(
      "depositedThicknessNm",
      "Deposited thickness must be a finite number at least 0.",
      "invalid_deposited_thickness",
    );
  if (
    !Number.isFinite(input.depositionTimeMinutes) ||
    input.depositionTimeMinutes <= 0
  )
    simpleError(
      "depositionTimeMinutes",
      "Deposition time must be a finite positive number.",
      "invalid_deposition_time",
    );
  const rateNmPerMinute =
    input.depositedThicknessNm === 0
      ? 0
      : input.depositedThicknessNm / input.depositionTimeMinutes;
  if (
    !Number.isFinite(rateNmPerMinute) ||
    (input.depositedThicknessNm > 0 && rateNmPerMinute === 0)
  )
    simpleError(
      "depositionTimeMinutes",
      "Deposition rate is outside the finite numeric range.",
      "numeric_range",
    );
  return {
    rateNmPerMinute,
  };
};

export const cvdDepositionRateTool = createSimpleTool({
  calculate: (input) =>
    calculateCvdDepositionRate({
      depositedThicknessNm: input.depositedThicknessNm as number,
      depositionTimeMinutes: input.depositionTimeMinutes as number,
    }),
  description:
    "Divide the deposited film thickness (final thickness minus initial thickness) by the process time to get the average CVD deposition rate.",
  id: "semiconductor/cvd-deposition-rate",
  inputs: [
    {
      description:
        "Thickness of the deposited film, defined as final thickness minus initial thickness. Must be at least 0 nm; 0 yields 0 nm/min.",
      format: "length",
      id: "depositedThicknessNm",
      kind: "number",
      label: "Deposited thickness",
      minimum: 0,
      unit: "nm",
    },
    {
      description: "Total CVD process time. Must be greater than 0 min.",
      format: "duration",
      id: "depositionTimeMinutes",
      kind: "number",
      label: "Deposition time",
      minimum: Number.MIN_VALUE,
      unit: "min",
    },
  ],
  outputs: [
    {
      description: "Average CVD deposition rate over the measured interval.",
      format: "rate",
      id: "rateNmPerMinute",
      kind: "number",
      label: "Deposition rate",
      minimum: 0,
      unit: "nm/min",
    },
  ],
  title: "CVD Deposition Rate Calculator",
});
export const runCvdDepositionRate = cvdDepositionRateTool.execute;
export default cvdDepositionRateTool;
