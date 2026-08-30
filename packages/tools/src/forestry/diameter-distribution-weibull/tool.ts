import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  count,
  ordered,
} from "../shared.js";
export type Input = Readonly<{
  readonly diameterClassEdgesCm: readonly number[];
  readonly weibullScaleCm: number;
  readonly weibullShape: number;
  readonly standStemCount: number;
}>;
export type Output = Readonly<{
  readonly expectedClassStemCounts: readonly number[];
  readonly expectedBelowFirstClassStemCount: number;
  readonly expectedAboveLastClassStemCount: number;
}>;
const inputFields = [
  {
    id: "diameterClassEdgesCm",
    label: "Diameter class edges cm",
    kind: "numberList",
  },
  { id: "weibullScaleCm", label: "Weibull scale cm", kind: "number" },
  { id: "weibullShape", label: "Weibull shape", kind: "number" },
  { id: "standStemCount", label: "Stand stem count", kind: "integer" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.weibullScaleCm, "weibullScaleCm");
  positive(input.weibullShape, "weibullShape");
  input.diameterClassEdgesCm.forEach((v) =>
    nonnegative(v, "diameterClassEdgesCm"),
  );
  count(input.standStemCount, "standStemCount");
  ordered(input.diameterClassEdgesCm, "diameterClassEdgesCm");
  const hazard = (d: number) =>
      (d / input.weibullScaleCm) ** input.weibullShape,
    expectedClassStemCounts = input.diameterClassEdgesCm
      .slice(1)
      .map((d, i) => {
        const lo = hazard(input.diameterClassEdgesCm[i]),
          hi = hazard(d);
        // Saturated lower hazard has no remaining survival. Otherwise expm1
        // retains tiny class shares that subtraction of near-one CDFs loses.
        return lo === Infinity
          ? 0
          : input.standStemCount * Math.exp(-lo) * -Math.expm1(-(hi - lo));
      });
  return {
    expectedClassStemCounts,
    expectedBelowFirstClassStemCount:
      input.standStemCount *
      -Math.expm1(-hazard(input.diameterClassEdgesCm[0])),
    expectedAboveLastClassStemCount:
      input.standStemCount *
      Math.exp(-hazard(input.diameterClassEdgesCm.at(-1)!)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  diameterClassEdgesCm: [0, 10, 20],
  weibullScaleCm: 10,
  weibullShape: 1,
  standStemCount: 100,
} satisfies Input;
export const exampleOutput = {
  expectedClassStemCounts: [63.212055882855765, 23.254415793482963],
  expectedBelowFirstClassStemCount: 0,
  expectedAboveLastClassStemCount: 13.53352832366127,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/diameter-distribution-weibull",
  title: "Weibull Diameter Distribution",
  description:
    "Predict Weibull diameter-class count inventory under supplied shape/scale, retaining below/above surveyed class tails; not random sampling or inferred stand-table coefficients.",
  inputs: inputFields,
  outputs: [
    {
      id: "expectedClassStemCounts",
      label: "Expected class stem counts",
      kind: "numberList",
    },
    {
      id: "expectedBelowFirstClassStemCount",
      label: "Expected below first class stem count",
      kind: "number",
    },
    {
      id: "expectedAboveLastClassStemCount",
      label: "Expected above last class stem count",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      diameterClassEdgesCm: value.diameterClassEdgesCm as readonly number[],
      weibullScaleCm: value.weibullScaleCm as number,
      weibullShape: value.weibullShape as number,
      standStemCount: value.standStemCount as number,
    }),
});
export const run = tool.execute;
export default tool;
