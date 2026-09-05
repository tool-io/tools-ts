import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  sum,
  shape,
  strictlyIncreasing,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly callerUnfoldingPercentages: readonly number[];
  readonly independentlyCorrectedDirectionVectors: readonly (readonly number[])[];
  readonly directionsPerUnfolding: number;
}>;
export type Output = Readonly<{
  readonly resultantConcentrations: readonly number[];
  readonly maximumConcentrationUnfoldingPercentages: readonly number[];
}>;
const inputFields = [
  {
    id: "callerUnfoldingPercentages",
    label: "Caller unfolding percentages",
    kind: "numberList",
  },
  {
    id: "independentlyCorrectedDirectionVectors",
    label: "Independently corrected direction vectors",
    kind: "matrix",
  },
  {
    id: "directionsPerUnfolding",
    label: "Directions per unfolding",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.directionsPerUnfolding, "directions", 2, 128);
  strictlyIncreasing(input.callerUnfoldingPercentages, "unfolding percentages");
  if (
    shape(input.independentlyCorrectedDirectionVectors, "vectors") !== 3 ||
    input.independentlyCorrectedDirectionVectors.length !==
      input.callerUnfoldingPercentages.length * input.directionsPerUnfolding
  )
    simpleError(
      "vectors",
      "Matched flattened unit-direction vectors by unfolding group.",
    );
  input.independentlyCorrectedDirectionVectors.forEach((v) => {
    if (Math.abs(Math.hypot(...v) - 1) > 1e-8)
      simpleError("unit", "Unit vectors independently tilt corrected.");
  });
  const r = input.callerUnfoldingPercentages.map((_, i) => {
      const v = input.independentlyCorrectedDirectionVectors.slice(
        i * input.directionsPerUnfolding,
        (i + 1) * input.directionsPerUnfolding,
      );
      return (
        Math.hypot(...[0, 1, 2].map((j) => sum(v.map((p) => p[j])))) / v.length
      );
    }),
    max = Math.max(...r);
  return {
    resultantConcentrations: r,
    maximumConcentrationUnfoldingPercentages:
      input.callerUnfoldingPercentages.filter((_, i) => r[i] === max),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerUnfoldingPercentages: [0, 50, 100],
  independentlyCorrectedDirectionVectors: [
    [1, 0, 0],
    [0, 1, 0],
    [1, 0, 0],
    [1, 0, 0],
    [1, 0, 0],
    [1, 0, 0],
  ],
  directionsPerUnfolding: 2,
} satisfies Input;
export const exampleOutput = {
  resultantConcentrations: [0.7071067811865476, 1, 1],
  maximumConcentrationUnfoldingPercentages: [50, 100],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/paleomagnetic-fold-test",
  title: "Geology Paleomagnetic Fold Test Calculator",
  description:
    "Observed unfolding-concentration fold-test screen from independent unit-vector rotations; ties retained, no bootstrap confidence or primary magnetization certification. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "resultantConcentrations",
      label: "Resultant concentrations",
      kind: "numberList",
    },
    {
      id: "maximumConcentrationUnfoldingPercentages",
      label: "Maximum concentration unfolding percentages",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerUnfoldingPercentages:
        value.callerUnfoldingPercentages as readonly number[],
      independentlyCorrectedDirectionVectors:
        value.independentlyCorrectedDirectionVectors as readonly (readonly number[])[],
      directionsPerUnfolding: value.directionsPerUnfolding as number,
    }),
});
export const run = tool.execute;
export default tool;
