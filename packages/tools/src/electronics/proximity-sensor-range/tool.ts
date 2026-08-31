import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
  monotone,
  crossing,
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly measuredDistancesMm: readonly number[];
  readonly measuredDetectionFractions: readonly number[];
  readonly callerMinimumDetectionFraction: number;
}>;
export type Output = Readonly<{
  readonly bracketedDetectionRangeMm: number;
  readonly detectionCriterionBracketed: boolean;
  readonly rangeObservationDomainMm: readonly number[];
}>;
const inputFields = [
  {
    id: "measuredDistancesMm",
    label: "Measured distances mm",
    kind: "numberList",
  },
  {
    id: "measuredDetectionFractions",
    label: "Measured detection fractions",
    kind: "numberList",
  },
  {
    id: "callerMinimumDetectionFraction",
    label: "Caller minimum detection fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.measuredDistancesMm.forEach((v) =>
    nonnegative(v, "measuredDistancesMm"),
  );
  input.measuredDetectionFractions.forEach((v) =>
    fraction(v, "measuredDetectionFractions"),
  );
  fraction(
    input.callerMinimumDetectionFraction,
    "callerMinimumDetectionFraction",
  );
  monotone(input.measuredDetectionFractions, "down", "detection");
  const c = crossing(
    input.measuredDistancesMm,
    input.measuredDetectionFractions,
    input.callerMinimumDetectionFraction,
  );
  return {
    bracketedDetectionRangeMm: c.value,
    detectionCriterionBracketed: c.found,
    rangeObservationDomainMm: [c.lowerBound, c.upperBound],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredDistancesMm: [0, 10, 20],
  measuredDetectionFractions: [1, 0.8, 0.2],
  callerMinimumDetectionFraction: 0.5,
} satisfies Input;
export const exampleOutput = {
  bracketedDetectionRangeMm: 15,
  detectionCriterionBracketed: true,
  rangeObservationDomainMm: [0, 20],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "electronics/proximity-sensor-range",
  title: "Proximity Sensor Range Calculator",
  description:
    "Read actual target-specific observed proximity detection fractions against caller criterion with bracket/censoring evidence; no inverse-square universal range, confidence interval or all-material sensor guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "bracketedDetectionRangeMm",
      label: "Bracketed detection range mm",
      kind: "number",
    },
    {
      id: "detectionCriterionBracketed",
      label: "Detection criterion bracketed",
      kind: "boolean",
    },
    {
      id: "rangeObservationDomainMm",
      label: "Range observation domain mm",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredDistancesMm: value.measuredDistancesMm as readonly number[],
      measuredDetectionFractions:
        value.measuredDetectionFractions as readonly number[],
      callerMinimumDetectionFraction:
        value.callerMinimumDetectionFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
