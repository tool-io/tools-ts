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
  mean,
  maximum,
  minimum,
} from "../shared.js";
export type Input = Readonly<{
  readonly observedEightArrowAxisDegrees: readonly number[];
  readonly observedEightArrowRadii: readonly number[];
  readonly callerIdealPhaseDegrees: number;
  readonly callerAngularToleranceDegrees: number;
  readonly callerRelativeRadialTolerance: number;
}>;
export type Output = Readonly<{
  readonly wrappedArrowAngularErrorsDegrees: readonly number[];
  readonly relativeArrowRadialRange: number;
  readonly withinCallerPatternPrecision: boolean;
}>;
const inputFields = [
  {
    id: "observedEightArrowAxisDegrees",
    label: "Observed eight arrow axis degrees",
    kind: "numberList",
  },
  {
    id: "observedEightArrowRadii",
    label: "Observed eight arrow radii",
    kind: "numberList",
  },
  {
    id: "callerIdealPhaseDegrees",
    label: "Caller ideal phase degrees",
    kind: "number",
  },
  {
    id: "callerAngularToleranceDegrees",
    label: "Caller angular tolerance degrees",
    kind: "number",
  },
  {
    id: "callerRelativeRadialTolerance",
    label: "Caller relative radial tolerance",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedEightArrowRadii.forEach((v) =>
    positive(v, "observedEightArrowRadii"),
  );
  nonnegative(
    input.callerAngularToleranceDegrees,
    "callerAngularToleranceDegrees",
  );
  nonnegative(
    input.callerRelativeRadialTolerance,
    "callerRelativeRadialTolerance",
  );
  if (
    input.observedEightArrowAxisDegrees.length !== 8 ||
    input.observedEightArrowRadii.length !== 8
  )
    simpleError(
      "pattern",
      "Eight correspondence-aligned arrow axes/radii required.",
    );
  const wrappedArrowAngularErrorsDegrees =
      input.observedEightArrowAxisDegrees.map(
        (v, i) =>
          ((((v - input.callerIdealPhaseDegrees - i * 45) % 360) + 540) % 360) -
          180,
      ),
    relativeArrowRadialRange =
      (maximum(input.observedEightArrowRadii) -
        minimum(input.observedEightArrowRadii)) /
      mean(input.observedEightArrowRadii);
  return {
    wrappedArrowAngularErrorsDegrees,
    relativeArrowRadialRange,
    withinCallerPatternPrecision:
      maximum(wrappedArrowAngularErrorsDegrees.map(Math.abs)) <=
        input.callerAngularToleranceDegrees &&
      relativeArrowRadialRange <= input.callerRelativeRadialTolerance,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedEightArrowAxisDegrees: [0, 45, 90, 135, 180, 225, 270, 315],
  observedEightArrowRadii: [1, 1, 1, 1, 1, 1, 1, 1],
  callerIdealPhaseDegrees: 0,
  callerAngularToleranceDegrees: 1,
  callerRelativeRadialTolerance: 0.1,
} satisfies Input;
export const exampleOutput = {
  wrappedArrowAngularErrorsDegrees: [0, 0, 0, 0, 0, 0, 0, 0],
  relativeArrowRadialRange: 0,
  withinCallerPatternPrecision: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/hearts-arrows-check",
  title: "Hearts and Arrows Precision Check",
  description:
    "Audit caller aligned eight-arrow angular/radial measurements against declared pattern precision; no automated hearts detection, branded cut certification or correction for lighting/registration.",
  inputs: inputFields,
  outputs: [
    {
      id: "wrappedArrowAngularErrorsDegrees",
      label: "Wrapped arrow angular errors degrees",
      kind: "numberList",
    },
    {
      id: "relativeArrowRadialRange",
      label: "Relative arrow radial range",
      kind: "number",
    },
    {
      id: "withinCallerPatternPrecision",
      label: "Within caller pattern precision",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observedEightArrowAxisDegrees:
        value.observedEightArrowAxisDegrees as readonly number[],
      observedEightArrowRadii:
        value.observedEightArrowRadii as readonly number[],
      callerIdealPhaseDegrees: value.callerIdealPhaseDegrees as number,
      callerAngularToleranceDegrees:
        value.callerAngularToleranceDegrees as number,
      callerRelativeRadialTolerance:
        value.callerRelativeRadialTolerance as number,
    }),
});
export const run = tool.execute;
export default tool;
