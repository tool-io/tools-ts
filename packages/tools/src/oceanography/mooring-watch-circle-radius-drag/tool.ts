import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  shape,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedMooringXyOffsetsM: readonly (readonly number[])[];
  readonly observedMatchedDragLoadsN: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedWatchCircleEnvelopeRadiusM: number;
  readonly dragAtEnvelopeWitnessN: readonly number[];
}>;
const inputFields = [
  {
    id: "observedMooringXyOffsetsM",
    label: "Observed mooring xy offsets m",
    kind: "matrix",
  },
  {
    id: "observedMatchedDragLoadsN",
    label: "Observed matched drag loads n",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedMatchedDragLoadsN.forEach((v) =>
    nonnegative(v, "observedMatchedDragLoadsN"),
  );
  if (shape(input.observedMooringXyOffsetsM, "offsets") !== 2)
    simpleError(
      "XY",
      "Local observed buoy offsets from fixed anchor, not GPS coordinates.",
    );
  aligned(
    input.observedMooringXyOffsetsM,
    input.observedMatchedDragLoadsN,
    "loads",
  );
  const radii = input.observedMooringXyOffsetsM.map((p) => Math.hypot(...p)),
    max = Math.max(...radii);
  return {
    observedWatchCircleEnvelopeRadiusM: max,
    dragAtEnvelopeWitnessN: input.observedMatchedDragLoadsN.filter(
      (_, i) => radii[i] === max,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedMooringXyOffsetsM: [
    [3, 4],
    [0, 2],
  ],
  observedMatchedDragLoadsN: [10, 20],
} satisfies Input;
export const exampleOutput = {
  observedWatchCircleEnvelopeRadiusM: 5,
  dragAtEnvelopeWitnessN: [10],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/mooring-watch-circle-radius-drag",
  title: "Mooring Watch Circle Radius Drag Calculator",
  description:
    "Actual offset envelope with matched drag witness, not catenary prediction, rope-length radius heuristic or mooring safety. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedWatchCircleEnvelopeRadiusM",
      label: "Observed watch circle envelope radius m",
      kind: "number",
    },
    {
      id: "dragAtEnvelopeWitnessN",
      label: "Drag at envelope witness n",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedMooringXyOffsetsM:
        value.observedMooringXyOffsetsM as readonly (readonly number[])[],
      observedMatchedDragLoadsN:
        value.observedMatchedDragLoadsN as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
