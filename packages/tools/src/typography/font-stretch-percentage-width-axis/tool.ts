import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../shared.js";
export type Input = Readonly<{
  readonly measuredNaturalTextAdvances: readonly number[];
  readonly measuredStretchedTextAdvances: readonly number[];
  readonly declaredWidthAxisPercent: number;
  readonly callerDeviationTolerancePercent: number;
}>;
export type Output = Readonly<{
  readonly observedWidthPercentages: readonly number[];
  readonly offCallerAxisCalibrationIndices: readonly number[];
  readonly pooledWidthPercentage: number;
}>;
const inputFields = [
  {
    id: "measuredNaturalTextAdvances",
    label: "Measured natural text advances",
    kind: "numberList",
  },
  {
    id: "measuredStretchedTextAdvances",
    label: "Measured stretched text advances",
    kind: "numberList",
  },
  {
    id: "declaredWidthAxisPercent",
    label: "Declared width axis percent",
    kind: "number",
  },
  {
    id: "callerDeviationTolerancePercent",
    label: "Caller deviation tolerance percent",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.measuredNaturalTextAdvances.forEach((v) =>
    positive(v, "measuredNaturalTextAdvances"),
  );
  input.measuredStretchedTextAdvances.forEach((v) =>
    nonnegative(v, "measuredStretchedTextAdvances"),
  );
  nonnegative(
    input.callerDeviationTolerancePercent,
    "callerDeviationTolerancePercent",
  );
  aligned(
    input.measuredNaturalTextAdvances,
    input.measuredStretchedTextAdvances,
    "measuredNaturalTextAdvances",
  );
  const p = input.measuredStretchedTextAdvances.map(
    (v, i) => (100 * v) / input.measuredNaturalTextAdvances[i],
  );
  return {
    observedWidthPercentages: p,
    offCallerAxisCalibrationIndices: p.flatMap((v, i) =>
      Math.abs(v - input.declaredWidthAxisPercent) >
      input.callerDeviationTolerancePercent
        ? [i]
        : [],
    ),
    pooledWidthPercentage:
      (100 * sum(input.measuredStretchedTextAdvances)) /
      sum(input.measuredNaturalTextAdvances),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredNaturalTextAdvances: [100, 50],
  measuredStretchedTextAdvances: [90, 48],
  declaredWidthAxisPercent: 90,
  callerDeviationTolerancePercent: 2,
} satisfies Input;
export const exampleOutput = {
  observedWidthPercentages: [90, 96],
  offCallerAxisCalibrationIndices: [1],
  pooledWidthPercentage: 92,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "typography/font-stretch-percentage-width-axis",
  title: "Font Stretch Percent Width Axis",
  description:
    "Audit measured width-axis effects on actual samples, using pooled advances rather than equal mean percentages; wdth percent is declared calibration, not guaranteed uniform glyph scaling.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedWidthPercentages",
      label: "Observed width percentages",
      kind: "numberList",
    },
    {
      id: "offCallerAxisCalibrationIndices",
      label: "Off caller axis calibration indices",
      kind: "numberList",
    },
    {
      id: "pooledWidthPercentage",
      label: "Pooled width percentage",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredNaturalTextAdvances:
        value.measuredNaturalTextAdvances as readonly number[],
      measuredStretchedTextAdvances:
        value.measuredStretchedTextAdvances as readonly number[],
      declaredWidthAxisPercent: value.declaredWidthAxisPercent as number,
      callerDeviationTolerancePercent:
        value.callerDeviationTolerancePercent as number,
    }),
});
export const run = tool.execute;
export default tool;
