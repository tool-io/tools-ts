import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  strictlyIncreasing,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly observedSpotTimesSeconds: readonly number[];
  readonly observedUnwrappedTorsoAnglesDegreesAtSpots: readonly number[];
  readonly callerMaximumSpotRotationErrorDegrees: number;
}>;
export type Output = Readonly<{
  readonly signedTorsoRpmBetweenSpots: readonly number[];
  readonly absoluteOneTurnErrorsDegrees: readonly number[];
  readonly spotIntervalsOutsideCallerOneTurnPolicy: readonly number[];
}>;
const inputFields = [
  {
    id: "observedSpotTimesSeconds",
    label: "Observed spot times seconds",
    kind: "numberList",
  },
  {
    id: "observedUnwrappedTorsoAnglesDegreesAtSpots",
    label: "Observed unwrapped torso angles degrees at spots",
    kind: "numberList",
  },
  {
    id: "callerMaximumSpotRotationErrorDegrees",
    label: "Caller maximum spot rotation error degrees",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(
    input.callerMaximumSpotRotationErrorDegrees,
    "callerMaximumSpotRotationErrorDegrees",
  );
  aligned(
    input.observedSpotTimesSeconds,
    input.observedUnwrappedTorsoAnglesDegreesAtSpots,
    "observedSpotTimesSeconds",
  );
  strictlyIncreasing(input.observedSpotTimesSeconds, "spots");
  const turns = input.observedUnwrappedTorsoAnglesDegreesAtSpots
      .slice(1)
      .map((v, i) => v - input.observedUnwrappedTorsoAnglesDegreesAtSpots[i]),
    errors = turns.map((v) => Math.abs(Math.abs(v) - 360));
  return {
    signedTorsoRpmBetweenSpots: turns.map(
      (v, i) =>
        ((v / 360) * 60) /
        (input.observedSpotTimesSeconds[i + 1] -
          input.observedSpotTimesSeconds[i]),
    ),
    absoluteOneTurnErrorsDegrees: errors,
    spotIntervalsOutsideCallerOneTurnPolicy: errors.flatMap((v, i) =>
      v > input.callerMaximumSpotRotationErrorDegrees ? [i] : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSpotTimesSeconds: [0, 1, 2],
  observedUnwrappedTorsoAnglesDegreesAtSpots: [0, 360, 720],
  callerMaximumSpotRotationErrorDegrees: 10,
} satisfies Input;
export const exampleOutput = {
  signedTorsoRpmBetweenSpots: [60, 60],
  absoluteOneTurnErrorsDegrees: [0, 0],
  spotIntervalsOutsideCallerOneTurnPolicy: [],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/pirouette-spotting-rotation-rpm-estimate",
  title: "Pirouette Spotting Rotation Rpm Estimate",
  description:
    "Audit actual pirouette spotting intervals against caller unwrapped torso rotation evidence and one-turn tolerance; not head RPM, inferred spotting from wrapped frames, dizziness or safe turn speed.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedTorsoRpmBetweenSpots",
      label: "Signed torso rpm between spots",
      kind: "numberList",
    },
    {
      id: "absoluteOneTurnErrorsDegrees",
      label: "Absolute one turn errors degrees",
      kind: "numberList",
    },
    {
      id: "spotIntervalsOutsideCallerOneTurnPolicy",
      label: "Spot intervals outside caller one turn policy",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSpotTimesSeconds:
        value.observedSpotTimesSeconds as readonly number[],
      observedUnwrappedTorsoAnglesDegreesAtSpots:
        value.observedUnwrappedTorsoAnglesDegreesAtSpots as readonly number[],
      callerMaximumSpotRotationErrorDegrees:
        value.callerMaximumSpotRotationErrorDegrees as number,
    }),
});
export const run = tool.execute;
export default tool;
