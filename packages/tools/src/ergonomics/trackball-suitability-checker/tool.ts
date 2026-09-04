import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  mean,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedMouseWristDeviationDegrees: readonly number[];
  readonly matchedTrialTrackballDeviationDegrees: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedTrialDeviationChangesDegrees: readonly number[];
  readonly observedMeanChangeDegrees: number;
}>;
const inputFields = [
  {
    id: "observedMouseWristDeviationDegrees",
    label: "Observed mouse wrist deviation degrees",
    kind: "numberList",
  },
  {
    id: "matchedTrialTrackballDeviationDegrees",
    label: "Matched trial trackball deviation degrees",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedMouseWristDeviationDegrees.forEach((v) =>
    nonnegative(v, "observedMouseWristDeviationDegrees"),
  );
  input.matchedTrialTrackballDeviationDegrees.forEach((v) =>
    nonnegative(v, "matchedTrialTrackballDeviationDegrees"),
  );
  aligned(
    input.observedMouseWristDeviationDegrees,
    input.matchedTrialTrackballDeviationDegrees,
    "observedMouseWristDeviationDegrees",
  );
  const d = input.matchedTrialTrackballDeviationDegrees.map(
    (v, i) => v - input.observedMouseWristDeviationDegrees[i],
  );
  return {
    signedTrialDeviationChangesDegrees: d,
    observedMeanChangeDegrees: mean(d),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedMouseWristDeviationDegrees: [10, 20],
  matchedTrialTrackballDeviationDegrees: [5, 25],
} satisfies Input;
export const exampleOutput = {
  signedTrialDeviationChangesDegrees: [-5, 5],
  observedMeanChangeDegrees: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/trackball-suitability-checker",
  title: "Trackball Alternative Suitability Wrist Deviation Checker",
  description:
    "Matched actual mouse/trackball trial absolute deviation magnitudes and signed changes, not recommendation from a single wrist posture. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedTrialDeviationChangesDegrees",
      label: "Signed trial deviation changes degrees",
      kind: "numberList",
    },
    {
      id: "observedMeanChangeDegrees",
      label: "Observed mean change degrees",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedMouseWristDeviationDegrees:
        value.observedMouseWristDeviationDegrees as readonly number[],
      matchedTrialTrackballDeviationDegrees:
        value.matchedTrialTrackballDeviationDegrees as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
