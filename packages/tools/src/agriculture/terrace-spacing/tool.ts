import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, aligned } from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedSlopeSegmentRiseM: readonly number[];
  readonly observedSlopeSegmentRunM: readonly number[];
  readonly callerPermittedTerraceVerticalIntervalsM: readonly number[];
}>;
export type Output = Readonly<{
  readonly callerHorizontalTerraceSpacingsM: readonly number[];
}>;
const inputFields = [
  {
    id: "observedSlopeSegmentRiseM",
    label: "Observed slope segment rise m",
    kind: "numberList",
  },
  {
    id: "observedSlopeSegmentRunM",
    label: "Observed slope segment run m",
    kind: "numberList",
  },
  {
    id: "callerPermittedTerraceVerticalIntervalsM",
    label: "Caller permitted terrace vertical intervals m",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedSlopeSegmentRiseM.forEach((v) =>
    positive(v, "observedSlopeSegmentRiseM"),
  );
  input.observedSlopeSegmentRunM.forEach((v) =>
    positive(v, "observedSlopeSegmentRunM"),
  );
  input.callerPermittedTerraceVerticalIntervalsM.forEach((v) =>
    positive(v, "callerPermittedTerraceVerticalIntervalsM"),
  );
  aligned(
    input.observedSlopeSegmentRiseM,
    input.observedSlopeSegmentRunM,
    "observedSlopeSegmentRiseM",
  );
  aligned(
    input.observedSlopeSegmentRiseM,
    input.callerPermittedTerraceVerticalIntervalsM,
    "observedSlopeSegmentRiseM",
  );
  return {
    callerHorizontalTerraceSpacingsM: input.observedSlopeSegmentRiseM.map(
      (v, i) =>
        (input.callerPermittedTerraceVerticalIntervalsM[i] *
          input.observedSlopeSegmentRunM[i]) /
        v,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSlopeSegmentRiseM: [1, 2],
  observedSlopeSegmentRunM: [10, 5],
  callerPermittedTerraceVerticalIntervalsM: [0.5, 1],
} satisfies Input;
export const exampleOutput = {
  callerHorizontalTerraceSpacingsM: [5, 2.5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/terrace-spacing",
  title: "Agriculture Terrace Spacing Calculator",
  description:
    "Actual varying slope segments and independently permitted vertical terrace intervals, horizontal spacing only, no empirical erosion/storage safety. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerHorizontalTerraceSpacingsM",
      label: "Caller horizontal terrace spacings m",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSlopeSegmentRiseM:
        value.observedSlopeSegmentRiseM as readonly number[],
      observedSlopeSegmentRunM:
        value.observedSlopeSegmentRunM as readonly number[],
      callerPermittedTerraceVerticalIntervalsM:
        value.callerPermittedTerraceVerticalIntervalsM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
