import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  aligned,
  strictlyIncreasing,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly observedUnwrappedBodyAnglesDegrees: readonly number[];
  readonly observedBarBoundaryIndices: readonly number[];
  readonly callerBeatsPerBar: number;
}>;
export type Output = Readonly<{
  readonly signedRotationsPerObservedBar: readonly number[];
  readonly signedRotationsPerBeat: readonly number[];
}>;
const inputFields = [
  {
    id: "observedUnwrappedBodyAnglesDegrees",
    label: "Observed unwrapped body angles degrees",
    kind: "numberList",
  },
  {
    id: "observedBarBoundaryIndices",
    label: "Observed bar boundary indices",
    kind: "numberList",
  },
  { id: "callerBeatsPerBar", label: "Caller beats per bar", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedUnwrappedBodyAnglesDegrees,
    input.observedBarBoundaryIndices,
    "observations",
  );
  strictlyIncreasing(input.observedBarBoundaryIndices, "bars");
  input.observedBarBoundaryIndices.forEach((v) =>
    bounded(v, "bar", 0, 1000000),
  );
  bounded(input.callerBeatsPerBar, "beats", 1, 32);
  const rotations = input.observedUnwrappedBodyAnglesDegrees
    .slice(1)
    .map(
      (v, i) =>
        (v - input.observedUnwrappedBodyAnglesDegrees[i]) /
        360 /
        (input.observedBarBoundaryIndices[i + 1] -
          input.observedBarBoundaryIndices[i]),
    );
  return {
    signedRotationsPerObservedBar: rotations,
    signedRotationsPerBeat: rotations.map((v) => v / input.callerBeatsPerBar),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedUnwrappedBodyAnglesDegrees: [0, 180, 360],
  observedBarBoundaryIndices: [0, 1, 2],
  callerBeatsPerBar: 3,
} satisfies Input;
export const exampleOutput = {
  signedRotationsPerObservedBar: [0.5, 0.5],
  signedRotationsPerBeat: [0.16666666666666666, 0.16666666666666666],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/viennese-waltz-rotations-per-bar-estimate",
  title: "Viennese Waltz Rotations Per Bar Estimate",
  description:
    "Estimate actual signed Viennese-waltz turns per measured bar interval from caller unwrapped orientation; no assuming half-turn per bar, wrapped-angle disambiguation or safe turn prescription.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedRotationsPerObservedBar",
      label: "Signed rotations per observed bar",
      kind: "numberList",
    },
    {
      id: "signedRotationsPerBeat",
      label: "Signed rotations per beat",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedUnwrappedBodyAnglesDegrees:
        value.observedUnwrappedBodyAnglesDegrees as readonly number[],
      observedBarBoundaryIndices:
        value.observedBarBoundaryIndices as readonly number[],
      callerBeatsPerBar: value.callerBeatsPerBar as number,
    }),
});
export const run = tool.execute;
export default tool;
