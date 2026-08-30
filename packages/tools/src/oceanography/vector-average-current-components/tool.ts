import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly eastwardCurrentsMPerSecond: readonly number[];
  readonly northwardCurrentsMPerSecond: readonly number[];
  readonly sampleDurationWeights: readonly number[];
}>;
export type Output = Readonly<{
  readonly meanEastwardCurrentMPerSecond: number;
  readonly meanNorthwardCurrentMPerSecond: number;
  readonly resultantMeanSpeedMPerSecond: number;
  readonly scalarMeanSpeedMPerSecond: number;
}>;
const inputFields = [
  {
    id: "eastwardCurrentsMPerSecond",
    label: "Eastward currents m per second",
    kind: "numberList",
  },
  {
    id: "northwardCurrentsMPerSecond",
    label: "Northward currents m per second",
    kind: "numberList",
  },
  {
    id: "sampleDurationWeights",
    label: "Sample duration weights",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.sampleDurationWeights.forEach((v) =>
    nonnegative(v, "sampleDurationWeights"),
  );
  aligned(
    input.eastwardCurrentsMPerSecond,
    input.northwardCurrentsMPerSecond,
    "eastwardCurrentsMPerSecond",
  );
  aligned(
    input.eastwardCurrentsMPerSecond,
    input.sampleDurationWeights,
    "eastwardCurrentsMPerSecond",
  );
  const total = positive(
      input.sampleDurationWeights.reduce((a, b) => a + b, 0),
      "sampleDurationWeights",
    ),
    u = input.eastwardCurrentsMPerSecond.reduce(
      (s, v, i) => s + (v * input.sampleDurationWeights[i]) / total,
      0,
    ),
    v = input.northwardCurrentsMPerSecond.reduce(
      (s, v, i) => s + (v * input.sampleDurationWeights[i]) / total,
      0,
    );
  return {
    meanEastwardCurrentMPerSecond: u,
    meanNorthwardCurrentMPerSecond: v,
    resultantMeanSpeedMPerSecond: Math.hypot(u, v),
    scalarMeanSpeedMPerSecond: input.eastwardCurrentsMPerSecond.reduce(
      (s, x, i) =>
        s +
        (Math.hypot(x, input.northwardCurrentsMPerSecond[i]) *
          input.sampleDurationWeights[i]) /
          total,
      0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  eastwardCurrentsMPerSecond: [1, -1],
  northwardCurrentsMPerSecond: [0, 0],
  sampleDurationWeights: [1, 3],
} satisfies Input;
export const exampleOutput = {
  meanEastwardCurrentMPerSecond: -0.5,
  meanNorthwardCurrentMPerSecond: 0,
  resultantMeanSpeedMPerSecond: 0.5,
  scalarMeanSpeedMPerSecond: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/vector-average-current-components",
  title: "Vector Average Current Components",
  description:
    "Distinguish duration-weighted vector resultant from scalar mean current speed, retaining reversals; does not infer coordinates or drifter displacements.",
  inputs: inputFields,
  outputs: [
    {
      id: "meanEastwardCurrentMPerSecond",
      label: "Mean eastward current m per second",
      kind: "number",
    },
    {
      id: "meanNorthwardCurrentMPerSecond",
      label: "Mean northward current m per second",
      kind: "number",
    },
    {
      id: "resultantMeanSpeedMPerSecond",
      label: "Resultant mean speed m per second",
      kind: "number",
    },
    {
      id: "scalarMeanSpeedMPerSecond",
      label: "Scalar mean speed m per second",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      eastwardCurrentsMPerSecond:
        value.eastwardCurrentsMPerSecond as readonly number[],
      northwardCurrentsMPerSecond:
        value.northwardCurrentsMPerSecond as readonly number[],
      sampleDurationWeights: value.sampleDurationWeights as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
