import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AdultMortality45Q15Input = {
  readonly nmx: readonly number[];
  readonly intervalWidth?: number;
  readonly aX?: number;
};

export type AdultMortality45Q15Output = {
  readonly adultMortality45q15: number;
};

export const calculateAdultMortality45Q15 = (
  input: AdultMortality45Q15Input,
): AdultMortality45Q15Output => {
  const intervalWidth = input.intervalWidth ?? 5;
  const aX = input.aX ?? intervalWidth / 2;
  if (!(intervalWidth > 0))
    simpleError(
      "intervalWidth",
      "The interval width must be greater than zero.",
      "invalid_interval",
    );
  if (!(aX >= 0 && aX <= intervalWidth))
    simpleError(
      "aX",
      "The separation factor must lie between zero and the interval width.",
      "invalid_interval",
    );
  if (input.nmx.length === 0)
    simpleError(
      "nmx",
      "Provide at least one age-specific death rate.",
      "invalid_list",
    );
  let survival = 1;
  for (const rate of input.nmx) {
    if (!(typeof rate === "number" && Number.isFinite(rate) && rate > 0))
      simpleError(
        "nmx",
        "Death rates must be finite and positive.",
        "invalid_rate",
      );
    const qx = (intervalWidth * rate) / (1 + (intervalWidth - aX) * rate);
    if (!(qx >= 0 && qx <= 1))
      simpleError(
        "nmx",
        "The converted interval probability of dying fell outside [0, 1]; check the separation factor.",
        "invalid_rate",
      );
    survival *= 1 - qx;
  }
  return { adultMortality45q15: 1 - survival };
};

export const adultMortality45Q15Example = {
  input: {
    nmx: [0.004, 0.005, 0.006, 0.008, 0.01, 0.013, 0.018, 0.026, 0.04],
    intervalWidth: 5,
    aX: 2.5,
  },
  output: { adultMortality45q15: 0.4784540736601579 },
} satisfies ToolExample<AdultMortality45Q15Input, AdultMortality45Q15Output>;

export const adultMortality45Q15Tool = createSimpleTool({
  id: "demography/adult-mortality-45q15",
  title: "Adult Mortality 45q15 Calculator",
  description:
    "Convert age-specific death rates for the five-year groups from age 15 into the probability of dying between ages 15 and 60 using q = n m / (1 + (n - a) m), with a default a of n/2 years.",
  inputs: [
    {
      description:
        "Death rates m(x) for each successive five-year group from age 15 to 59.",
      id: "nmx",
      kind: "numberList",
      label: "m(x)",
    },
    {
      default: 5,
      description: "Width of each age interval in years.",
      id: "intervalWidth",
      kind: "number",
      label: "Width n",
      minimum: 0,
    },
    {
      description:
        "Average years lived within the interval by those dying; defaults to half the interval width.",
      id: "aX",
      kind: "number",
      label: "a(x)",
      minimum: 0,
      required: false,
    },
  ],
  outputs: [
    {
      description: "Probability of dying between ages 15 and 60.",
      id: "adultMortality45q15",
      kind: "number",
      label: "45q15",
    },
  ],
  calculate: (input) =>
    calculateAdultMortality45Q15(input as unknown as AdultMortality45Q15Input),
});

export const runAdultMortality45Q15 = adultMortality45Q15Tool.execute;
export default adultMortality45Q15Tool;
