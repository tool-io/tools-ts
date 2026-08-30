import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly numeratorXrfSignals: readonly number[];
  readonly denominatorXrfSignals: readonly number[];
  readonly numeratorBlanks: readonly number[];
  readonly denominatorBlanks: readonly number[];
  readonly numeratorResponsePerConcentration: number;
  readonly denominatorResponsePerConcentration: number;
  readonly callerSourceRatioBounds: readonly number[];
}>;
export type Output = Readonly<{
  readonly calibratedElementRatios: readonly number[];
  readonly withinCallerSourceBandFlags: readonly number[];
}>;
const inputFields = [
  {
    id: "numeratorXrfSignals",
    label: "Numerator xrf signals",
    kind: "numberList",
  },
  {
    id: "denominatorXrfSignals",
    label: "Denominator xrf signals",
    kind: "numberList",
  },
  { id: "numeratorBlanks", label: "Numerator blanks", kind: "numberList" },
  { id: "denominatorBlanks", label: "Denominator blanks", kind: "numberList" },
  {
    id: "numeratorResponsePerConcentration",
    label: "Numerator response per concentration",
    kind: "number",
  },
  {
    id: "denominatorResponsePerConcentration",
    label: "Denominator response per concentration",
    kind: "number",
  },
  {
    id: "callerSourceRatioBounds",
    label: "Caller source ratio bounds",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.numeratorResponsePerConcentration,
    "numeratorResponsePerConcentration",
  );
  positive(
    input.denominatorResponsePerConcentration,
    "denominatorResponsePerConcentration",
  );
  input.numeratorXrfSignals.forEach((v) =>
    nonnegative(v, "numeratorXrfSignals"),
  );
  input.denominatorXrfSignals.forEach((v) =>
    nonnegative(v, "denominatorXrfSignals"),
  );
  input.numeratorBlanks.forEach((v) => nonnegative(v, "numeratorBlanks"));
  input.denominatorBlanks.forEach((v) => nonnegative(v, "denominatorBlanks"));
  input.callerSourceRatioBounds.forEach((v) =>
    nonnegative(v, "callerSourceRatioBounds"),
  );
  aligned(
    input.numeratorXrfSignals,
    input.denominatorXrfSignals,
    "numeratorXrfSignals",
  );
  aligned(
    input.numeratorXrfSignals,
    input.numeratorBlanks,
    "numeratorXrfSignals",
  );
  aligned(
    input.numeratorXrfSignals,
    input.denominatorBlanks,
    "numeratorXrfSignals",
  );
  if (
    input.callerSourceRatioBounds.length !== 2 ||
    input.callerSourceRatioBounds[0] > input.callerSourceRatioBounds[1]
  )
    simpleError("bounds", "Ordered source ratio bounds required.");
  const calibratedElementRatios = input.numeratorXrfSignals.map(
    (v, i) =>
      (v - input.numeratorBlanks[i]) /
      input.numeratorResponsePerConcentration /
      (positive(
        input.denominatorXrfSignals[i] - input.denominatorBlanks[i],
        "denominatorBlanks",
      ) /
        input.denominatorResponsePerConcentration),
  );
  return {
    calibratedElementRatios,
    withinCallerSourceBandFlags: calibratedElementRatios.map((r) =>
      r >= input.callerSourceRatioBounds[0] &&
      r <= input.callerSourceRatioBounds[1]
        ? 1
        : 0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  numeratorXrfSignals: [10, 20],
  denominatorXrfSignals: [5, 5],
  numeratorBlanks: [0, 5],
  denominatorBlanks: [0, 0],
  numeratorResponsePerConcentration: 2,
  denominatorResponsePerConcentration: 1,
  callerSourceRatioBounds: [1, 1.2],
} satisfies Input;
export const exampleOutput = {
  calibratedElementRatios: [1, 1.5],
  withinCallerSourceBandFlags: [1, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/xrf-element-ratio-provenance",
  title: "XRF Element Ratio Provenance Tool",
  description:
    "Blank/response-correct paired XRF element signals and screen a supplied source ratio band; signed numerator nondetections remain visible and a single ratio does not identify provenance.",
  inputs: inputFields,
  outputs: [
    {
      id: "calibratedElementRatios",
      label: "Calibrated element ratios",
      kind: "numberList",
    },
    {
      id: "withinCallerSourceBandFlags",
      label: "Within caller source band flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      numeratorXrfSignals: value.numeratorXrfSignals as readonly number[],
      denominatorXrfSignals: value.denominatorXrfSignals as readonly number[],
      numeratorBlanks: value.numeratorBlanks as readonly number[],
      denominatorBlanks: value.denominatorBlanks as readonly number[],
      numeratorResponsePerConcentration:
        value.numeratorResponsePerConcentration as number,
      denominatorResponsePerConcentration:
        value.denominatorResponsePerConcentration as number,
      callerSourceRatioBounds:
        value.callerSourceRatioBounds as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
