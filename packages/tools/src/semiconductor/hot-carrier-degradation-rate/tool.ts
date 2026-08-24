import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HotCarrierDegradationRateInput = {
  readonly substrateToDrainCurrentRatio: number;
  readonly coefficientPercentPerYear: number;
  readonly exponentN: number;
};

export type HotCarrierDegradationRateOutput = {
  readonly degradationPercentPerYear: number;
};

export const hotCarrierDegradationRateExample = {
  input: {
    coefficientPercentPerYear: 2,
    exponentN: 3,
    substrateToDrainCurrentRatio: 0.5,
  },
  output: { degradationPercentPerYear: 0.25 },
} satisfies ToolExample<
  HotCarrierDegradationRateInput,
  HotCarrierDegradationRateOutput
>;

export const calculateHotCarrierDegradationRate = (
  input: HotCarrierDegradationRateInput,
): HotCarrierDegradationRateOutput => {
  const { coefficientPercentPerYear, exponentN, substrateToDrainCurrentRatio } =
    input;
  if (
    !Number.isFinite(substrateToDrainCurrentRatio) ||
    substrateToDrainCurrentRatio < 0
  )
    simpleError(
      "substrateToDrainCurrentRatio",
      "Substrate-to-drain current ratio must be nonnegative.",
    );
  if (
    !Number.isFinite(coefficientPercentPerYear) ||
    coefficientPercentPerYear < 0
  )
    simpleError(
      "coefficientPercentPerYear",
      "Calibrated coefficient must be nonnegative.",
    );
  if (!Number.isFinite(exponentN) || exponentN <= 0)
    simpleError("exponentN", "Power-law exponent must be positive.");
  const direct =
    coefficientPercentPerYear *
    Math.pow(substrateToDrainCurrentRatio, exponentN);
  const degradationPercentPerYear =
    coefficientPercentPerYear === 0 || substrateToDrainCurrentRatio === 0
      ? 0
      : Number.isFinite(direct) && direct > 0
        ? direct
        : coefficientPercentPerYear *
          Math.exp(exponentN * Math.log(substrateToDrainCurrentRatio));
  if (!Number.isFinite(degradationPercentPerYear))
    simpleError(
      "substrateToDrainCurrentRatio",
      "The degradation rate is outside the representable range.",
      "numeric_range",
    );
  if (
    degradationPercentPerYear === 0 &&
    coefficientPercentPerYear > 0 &&
    substrateToDrainCurrentRatio > 0
  )
    simpleError(
      "substrateToDrainCurrentRatio",
      "The degradation rate is below the representable range.",
      "numeric_underflow",
    );
  return { degradationPercentPerYear };
};

export const hotCarrierDegradationRateTool = createSimpleTool({
  id: "semiconductor/hot-carrier-degradation-rate",
  title: "Hot Carrier Degradation Rate Calculator",
  description:
    "Evaluate a calibrated power-law model for hot-carrier-induced parameter drift from the substrate-to-drain current ratio.",
  inputs: [
    {
      description:
        "Substrate current divided by drain current under operating bias.",
      id: "substrateToDrainCurrentRatio",
      kind: "number",
      label: "Substrate to drain current ratio",
      minimum: 0,
    },
    {
      description:
        "Measured process- and bias-dependent rate when the current ratio equals one.",
      id: "coefficientPercentPerYear",
      kind: "number",
      label: "Calibrated coefficient",
      minimum: 0,
      unit: "%/year",
    },
    {
      description: "Power-law exponent N applied to the current ratio.",
      id: "exponentN",
      kind: "number",
      label: "Exponent N",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      id: "degradationPercentPerYear",
      kind: "number",
      label: "Degradation rate",
      minimum: 0,
      unit: "%/year",
    },
  ],
  calculate: (input) =>
    calculateHotCarrierDegradationRate({
      coefficientPercentPerYear: input.coefficientPercentPerYear as number,
      exponentN: input.exponentN as number,
      substrateToDrainCurrentRatio:
        input.substrateToDrainCurrentRatio as number,
    }),
});
export const runHotCarrierDegradationRate =
  hotCarrierDegradationRateTool.execute;
export default hotCarrierDegradationRateTool;
