import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  crossings,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedPaintElapsedMinutes: readonly number[];
  readonly observedPaintViscosityPaSecond: readonly number[];
  readonly callerVerifiedMaximumWorkabilityViscosityPaSecond: number;
}>;
export type Output = Readonly<{
  readonly observedWorkabilityThresholdCrossingsMinutes: readonly number[];
  readonly rightCensoredBelowThreshold: boolean;
}>;
const inputFields = [
  {
    id: "observedPaintElapsedMinutes",
    label: "Observed paint elapsed minutes",
    kind: "numberList",
  },
  {
    id: "observedPaintViscosityPaSecond",
    label: "Observed paint viscosity pa second",
    kind: "numberList",
  },
  {
    id: "callerVerifiedMaximumWorkabilityViscosityPaSecond",
    label: "Caller verified maximum workability viscosity pa second",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedPaintViscosityPaSecond.forEach((v) =>
    positive(v, "observedPaintViscosityPaSecond"),
  );
  positive(
    input.callerVerifiedMaximumWorkabilityViscosityPaSecond,
    "callerVerifiedMaximumWorkabilityViscosityPaSecond",
  );
  input.observedPaintElapsedMinutes.forEach((v) =>
    nonnegative(v, "observedPaintElapsedMinutes"),
  );
  const hits = crossings(
    input.observedPaintElapsedMinutes,
    input.observedPaintViscosityPaSecond,
    input.callerVerifiedMaximumWorkabilityViscosityPaSecond,
  );
  return {
    observedWorkabilityThresholdCrossingsMinutes: hits,
    rightCensoredBelowThreshold:
      hits.length === 0 &&
      input.observedPaintViscosityPaSecond.at(-1)! <
        input.callerVerifiedMaximumWorkabilityViscosityPaSecond,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPaintElapsedMinutes: [0, 10, 30],
  observedPaintViscosityPaSecond: [1, 2, 4],
  callerVerifiedMaximumWorkabilityViscosityPaSecond: 3,
} satisfies Input;
export const exampleOutput = {
  observedWorkabilityThresholdCrossingsMinutes: [20],
  rightCensoredBelowThreshold: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "construction/paint-pot-life",
  title: "Paint Pot Life Calculator",
  description:
    "Completed mixed-coating workability trace crossings and right-censored below-threshold evidence, no chemical mixing/dosing, predictive Arrhenius potlife or readiness. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedWorkabilityThresholdCrossingsMinutes",
      label: "Observed workability threshold crossings minutes",
      kind: "numberList",
    },
    {
      id: "rightCensoredBelowThreshold",
      label: "Right censored below threshold",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observedPaintElapsedMinutes:
        value.observedPaintElapsedMinutes as readonly number[],
      observedPaintViscosityPaSecond:
        value.observedPaintViscosityPaSecond as readonly number[],
      callerVerifiedMaximumWorkabilityViscosityPaSecond:
        value.callerVerifiedMaximumWorkabilityViscosityPaSecond as number,
    }),
});
export const run = tool.execute;
export default tool;
