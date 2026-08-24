import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CommonEmitterGainInput = {
  readonly alpha: number;
};

export type CommonEmitterGainOutput = {
  readonly beta: number;
};

export const commonEmitterCurrentGainExample = {
  input: { alpha: 0.99 },
  output: { beta: 98.99999999999991 },
} satisfies ToolExample<CommonEmitterGainInput, CommonEmitterGainOutput>;

export const calculateCommonEmitterGain = (
  input: CommonEmitterGainInput,
): CommonEmitterGainOutput => {
  const alpha = input.alpha;

  if (!Number.isFinite(alpha))
    simpleError("alpha", "Alpha must be a finite number.", "invalid_alpha");

  if (alpha <= 0 || alpha >= 1)
    simpleError(
      "alpha",
      "Alpha must be strictly between 0 and 1 (exclusive).",
      "invalid_alpha",
    );

  const oneMinusAlpha = 1 - alpha;
  if (!Number.isFinite(oneMinusAlpha))
    simpleError("alpha", "One minus alpha overflowed.", "numeric_overflow");

  if (oneMinusAlpha === 0)
    simpleError(
      "alpha",
      "Alpha too close to 1 causes division by zero.",
      "numeric_overflow",
    );

  if (oneMinusAlpha <= 0)
    simpleError("alpha", "One minus alpha must be positive.", "invalid_alpha");

  const beta = alpha / oneMinusAlpha;
  if (!Number.isFinite(beta))
    simpleError("alpha", "Beta overflowed.", "numeric_overflow");

  return { beta: beta === 0 ? 0 : beta };
};

export const commonEmitterCurrentGainTool = createSimpleTool({
  calculate: (input) =>
    calculateCommonEmitterGain({
      alpha: input.alpha as number,
    }),
  description:
    "Convert the common-base current gain (alpha) to the common-emitter current gain (beta) via beta=alpha/(1-alpha) with alpha in (0,1) exclusive, dimensionless. Full double precision without premature rounding; handles near-1 cancellation by checking 1-alpha finite and non-zero and beta finite, reporting numeric_overflow for extreme alpha. Ideal transistor relation neglecting recombination and series resistance; invalid for alpha<=0 or >=1.",
  id: "semiconductor/bjt-common-emitter-current-gain",
  inputs: [
    {
      description:
        "Common-base current gain; must be a finite number strictly between 0 and 1 exclusive.",
      format: "gain",
      id: "alpha",
      kind: "number",
      label: "Alpha",
      maximum: 1,
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      description:
        "Common-emitter current gain beta=alpha/(1-alpha). Finite, >0; grows without bound as alpha→1-.",
      format: "gain",
      id: "beta",
      kind: "number",
      label: "Beta",
      minimum: Number.MIN_VALUE,
    },
  ],
  title: "BJT Common-Emitter Current Gain Calculator",
});
export const runCommonEmitterCurrentGain = commonEmitterCurrentGainTool.execute;
export default commonEmitterCurrentGainTool;
