import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  aligned,
  positive,
  strictlyIncreasing,
  fit,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualElapsedTimesHours: readonly number[];
  readonly actualIndependentlyResolvedExcretedPoolRemainingMass: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualElapsedTimesHours",
    label: "Actual elapsed times hours",
    kind: "numberList",
  },
  {
    id: "actualIndependentlyResolvedExcretedPoolRemainingMass",
    label: "Actual independently resolved excreted pool remaining mass",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.actualElapsedTimesHours,
    input.actualIndependentlyResolvedExcretedPoolRemainingMass,
    "samples",
  );
  strictlyIncreasing(input.actualElapsedTimesHours, "time", 2);
  input.actualIndependentlyResolvedExcretedPoolRemainingMass.forEach((v) =>
    positive(v, "remaining-pool"),
  );
  const s = fit(
    input.actualElapsedTimesHours,
    input.actualIndependentlyResolvedExcretedPoolRemainingMass.map(Math.log),
  ).slope;
  if (s >= 0)
    simpleError(
      "decay",
      "Independent excretion-pool observations require a decreasing logfit.",
    );
  return {
    observedLogDecaySlopePerHour: s,
    conditionalFirstOrderExcretionHalfLifeHours: -Math.log(2) / s,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualElapsedTimesHours: [0, 1, 2],
    actualIndependentlyResolvedExcretedPoolRemainingMass: [8, 4, 2],
  },
  output: {
    result: {
      observedLogDecaySlopePerHour: -0.6931471805599453,
      conditionalFirstOrderExcretionHalfLifeHours: 1,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/adme-excretion-half-life",
  title: "Excretion Half-Life Calculator",
  description:
    "Fit actual independently resolved excretion-only remaining-pool logmass versus time and invert negative slope. Not total elimination half-life from metabolism+excretion or half-life from two unconstrained points; first-order model/correct pool external.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
