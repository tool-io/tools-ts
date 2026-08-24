import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ApdMultiplicationFactorInput = {
  readonly breakdownVolts: number;
  readonly exponentN?: number;
  readonly reverseBiasVolts: number;
};

export type ApdMultiplicationFactorOutput = {
  readonly multiplicationFactor: number;
};

export const apdMultiplicationFactorExample = {
  input: { breakdownVolts: 100, exponentN: 2, reverseBiasVolts: 90 },
  output: { multiplicationFactor: 5.263157894736843 },
} satisfies ToolExample<
  ApdMultiplicationFactorInput,
  ApdMultiplicationFactorOutput
>;

export const calculateApdMultiplicationFactor = (
  input: ApdMultiplicationFactorInput,
): ApdMultiplicationFactorOutput => {
  const breakdownVolts = input.breakdownVolts;
  const reverseBiasVolts = input.reverseBiasVolts;
  const exponentN = input.exponentN ?? 2;

  if (!Number.isFinite(breakdownVolts) || breakdownVolts <= 0)
    simpleError(
      "breakdownVolts",
      "Breakdown voltage must be a finite positive number.",
      "invalid_breakdown",
    );

  if (!Number.isFinite(reverseBiasVolts) || reverseBiasVolts < 0)
    simpleError(
      "reverseBiasVolts",
      "Reverse bias must be a finite number at least 0.",
      "invalid_reverse_bias",
    );

  if (!Number.isFinite(exponentN) || exponentN < 1 || exponentN > 6)
    simpleError(
      "exponentN",
      "Exponent N must be a finite number in [1, 6].",
      "invalid_exponent",
    );

  if (!(reverseBiasVolts < breakdownVolts))
    simpleError(
      "reverseBiasVolts",
      "Reverse bias must stay below breakdown (V < Vb); at or above breakdown the Miller model diverges.",
      "above_breakdown",
    );

  // Normalize -0 bias to +0 (0 yields M=1)
  const normalizedBias = reverseBiasVolts === 0 ? 0 : reverseBiasVolts;

  const relativeGap = (breakdownVolts - normalizedBias) / breakdownVolts;
  const directDenom = 1 - (normalizedBias / breakdownVolts) ** exponentN;
  const denom =
    normalizedBias === 0
      ? 1
      : directDenom > 1e-8
        ? directDenom
        : -Math.expm1(exponentN * Math.log1p(-relativeGap));
  // The expm1 form preserves the denominator as V approaches Vb.
  if (denom <= 0 || !Number.isFinite(denom))
    simpleError(
      "reverseBiasVolts",
      "Multiplication factor diverged at this bias (denominator non-positive).",
      "above_breakdown",
    );

  const multiplicationFactor = 1 / denom;

  if (!Number.isFinite(multiplicationFactor))
    simpleError(
      "reverseBiasVolts",
      "Multiplication factor could not be calculated due to numeric overflow.",
      "numeric_overflow",
    );

  return {
    multiplicationFactor: multiplicationFactor === 0 ? 0 : multiplicationFactor,
  };
};

export const apdMultiplicationFactorTool = createSimpleTool({
  calculate: (input) =>
    calculateApdMultiplicationFactor({
      breakdownVolts: input.breakdownVolts as number,
      exponentN: (input.exponentN as number | undefined) ?? undefined,
      reverseBiasVolts: input.reverseBiasVolts as number,
    }),
  description:
    "Compute the avalanche photodiode multiplication factor from the Miller model M=1/[1-(V/Vb)^N]. Inputs are magnitudes: reverse-bias magnitude V≥0 V must remain below breakdown magnitude Vb>0 V (numerator V, denominator Vb; V=0 gives M=1, V→Vb- diverges). Exponent N in [1, 6] (default 2) captures the ionization coefficients. Signed voltages are not supported (use magnitudes). Result M≥1 is a dimensionless factor (per-carrier gain, not total current).",
  id: "semiconductor/apd-multiplication-factor",
  inputs: [
    {
      description:
        "Applied reverse-bias voltage magnitude. Must be at least 0 V and strictly below breakdown; 0 yields M=1. Signed values not supported.",
      id: "reverseBiasVolts",
      kind: "number",
      label: "Reverse bias",
      minimum: 0,
      unit: "V",
    },
    {
      description:
        "Breakdown voltage magnitude at the operating conditions. Must be greater than 0 V; denominator for V/Vb.",
      id: "breakdownVolts",
      kind: "number",
      label: "Breakdown voltage",
      minimum: Number.MIN_VALUE,
      unit: "V",
    },
    {
      default: 2,
      description:
        "Ionization exponent N in the Miller model. Must be in [1, 6]; default 2.",
      id: "exponentN",
      kind: "number",
      label: "Exponent N",
      maximum: 6,
      minimum: 1,
    },
  ],
  outputs: [
    {
      description:
        "Avalanche multiplication factor M≥1 (dimensionless gain per primary carrier).",
      format: "factor",
      id: "multiplicationFactor",
      kind: "number",
      label: "Multiplication factor",
      minimum: 1,
    },
  ],
  title: "APD Multiplication Factor Calculator",
});
export const runApdMultiplicationFactor = apdMultiplicationFactorTool.execute;
export default apdMultiplicationFactorTool;
