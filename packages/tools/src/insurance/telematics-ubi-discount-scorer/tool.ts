import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  fraction,
  bounded,
  aligned,
  unique,
  sum,
  interpolate,
  weights,
  weightedMinor,
  money,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerTelematicsMetricIds: readonly string[];
  readonly observedCallerNormalizedPenaltyScores: readonly number[];
  readonly callerMetricWeights: readonly number[];
  readonly callerDiscountScoreKnots: readonly number[];
  readonly callerDiscountBasisPointKnots: readonly number[];
  readonly callerBaseAnnualPremiumMinor: number;
}>;
export type Output = Readonly<{
  readonly callerWeightedPenaltyScore: number;
  readonly callerInterpolatedDiscountBasisPoints: number;
  readonly callerRoundedUbiDiscountMinor: number;
}>;
const inputFields = [
  {
    id: "callerTelematicsMetricIds",
    label: "Caller telematics metric ids",
    kind: "stringList",
  },
  {
    id: "observedCallerNormalizedPenaltyScores",
    label: "Observed caller normalized penalty scores",
    kind: "numberList",
  },
  {
    id: "callerMetricWeights",
    label: "Caller metric weights",
    kind: "numberList",
  },
  {
    id: "callerDiscountScoreKnots",
    label: "Caller discount score knots",
    kind: "numberList",
  },
  {
    id: "callerDiscountBasisPointKnots",
    label: "Caller discount basis point knots",
    kind: "numberList",
  },
  {
    id: "callerBaseAnnualPremiumMinor",
    label: "Caller base annual premium minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  unique(input.callerTelematicsMetricIds, "metrics");
  aligned(
    input.callerTelematicsMetricIds,
    input.observedCallerNormalizedPenaltyScores,
    "metrics",
  );
  aligned(
    input.callerMetricWeights,
    input.observedCallerNormalizedPenaltyScores,
    "metrics",
  );
  input.observedCallerNormalizedPenaltyScores.forEach((v) =>
    fraction(v, "score"),
  );
  input.callerDiscountBasisPointKnots.forEach((v) =>
    bounded(v, "bps", 0, 10000),
  );
  money(input.callerBaseAnnualPremiumMinor);
  const w = weights(input.callerMetricWeights),
    score = sum(
      w.map((v, i) => v * input.observedCallerNormalizedPenaltyScores[i]),
    ),
    bps = interpolate(
      input.callerDiscountScoreKnots,
      input.callerDiscountBasisPointKnots,
      score,
    );
  return {
    callerWeightedPenaltyScore: score,
    callerInterpolatedDiscountBasisPoints: bps,
    callerRoundedUbiDiscountMinor: weightedMinor(
      input.callerBaseAnnualPremiumMinor,
      Math.round(bps),
      10000,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerTelematicsMetricIds: ["braking", "distance"],
  observedCallerNormalizedPenaltyScores: [0.2, 0.6],
  callerMetricWeights: [1, 3],
  callerDiscountScoreKnots: [0, 1],
  callerDiscountBasisPointKnots: [2000, 0],
  callerBaseAnnualPremiumMinor: 10000,
} satisfies Input;
export const exampleOutput = {
  callerWeightedPenaltyScore: 0.5,
  callerInterpolatedDiscountBasisPoints: 1000,
  callerRoundedUbiDiscountMinor: 1000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/telematics-ubi-discount-scorer",
  title: "Telematics UBI Discount Scorer",
  description:
    "Score actual independently normalized telematics metrics under caller weights/calibrated score→discount curve; interpolated bps round to whole bps before exact premium rounding, no proprietary insurer model or driver safety conclusion.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerWeightedPenaltyScore",
      label: "Caller weighted penalty score",
      kind: "number",
    },
    {
      id: "callerInterpolatedDiscountBasisPoints",
      label: "Caller interpolated discount basis points",
      kind: "number",
    },
    {
      id: "callerRoundedUbiDiscountMinor",
      label: "Caller rounded ubi discount minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerTelematicsMetricIds:
        value.callerTelematicsMetricIds as readonly string[],
      observedCallerNormalizedPenaltyScores:
        value.observedCallerNormalizedPenaltyScores as readonly number[],
      callerMetricWeights: value.callerMetricWeights as readonly number[],
      callerDiscountScoreKnots:
        value.callerDiscountScoreKnots as readonly number[],
      callerDiscountBasisPointKnots:
        value.callerDiscountBasisPointKnots as readonly number[],
      callerBaseAnnualPremiumMinor:
        value.callerBaseAnnualPremiumMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
