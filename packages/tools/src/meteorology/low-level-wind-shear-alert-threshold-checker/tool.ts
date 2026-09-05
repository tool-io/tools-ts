import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedAlongRunwayWindChangesKnots: readonly number[];
  readonly callerAlertMagnitudeKnots: number;
}>;
export type Output = Readonly<{
  readonly signedAlertReservesKnots: readonly number[];
  readonly callerAlertIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedAlongRunwayWindChangesKnots",
    label: "Observed along runway wind changes knots",
    kind: "numberList",
  },
  {
    id: "callerAlertMagnitudeKnots",
    label: "Caller alert magnitude knots",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerAlertMagnitudeKnots, "callerAlertMagnitudeKnots");
  return {
    signedAlertReservesKnots: input.observedAlongRunwayWindChangesKnots.map(
      (v) => input.callerAlertMagnitudeKnots - Math.abs(v),
    ),
    callerAlertIndices: input.observedAlongRunwayWindChangesKnots.flatMap(
      (v, i) => (Math.abs(v) >= input.callerAlertMagnitudeKnots ? [i] : []),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedAlongRunwayWindChangesKnots: [10, -20],
  callerAlertMagnitudeKnots: 15,
} satisfies Input;
export const exampleOutput = {
  signedAlertReservesKnots: [5, -5],
  callerAlertIndices: [1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/low-level-wind-shear-alert-threshold-checker",
  title: "Low Level Wind Shear Alert Threshold Checker",
  description:
    "Actual signed runway wind gains/losses against caller independently verified magnitude threshold, equality alerts; not live airport alert or aviation safety. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedAlertReservesKnots",
      label: "Signed alert reserves knots",
      kind: "numberList",
    },
    {
      id: "callerAlertIndices",
      label: "Caller alert indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedAlongRunwayWindChangesKnots:
        value.observedAlongRunwayWindChangesKnots as readonly number[],
      callerAlertMagnitudeKnots: value.callerAlertMagnitudeKnots as number,
    }),
});
export const run = tool.execute;
export default tool;
