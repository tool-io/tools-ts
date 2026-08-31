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
  strictlyIncreasing,
  sequence,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly observedTripleStepBeatPositions: readonly number[];
  readonly callerExpectedTripleOffsetsBeats: readonly number[];
  readonly callerTripleAnchorBeat: number;
  readonly callerPlacementToleranceBeats: number;
}>;
export type Output = Readonly<{
  readonly observedTripleOffsetsBeats: readonly number[];
  readonly tripleStepPlacementDeviationsBeats: readonly number[];
  readonly withinCallerTriplePlacement: boolean;
}>;
const inputFields = [
  {
    id: "observedTripleStepBeatPositions",
    label: "Observed triple step beat positions",
    kind: "numberList",
  },
  {
    id: "callerExpectedTripleOffsetsBeats",
    label: "Caller expected triple offsets beats",
    kind: "numberList",
  },
  {
    id: "callerTripleAnchorBeat",
    label: "Caller triple anchor beat",
    kind: "number",
  },
  {
    id: "callerPlacementToleranceBeats",
    label: "Caller placement tolerance beats",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.callerTripleAnchorBeat, "callerTripleAnchorBeat");
  nonnegative(
    input.callerPlacementToleranceBeats,
    "callerPlacementToleranceBeats",
  );
  aligned(
    input.observedTripleStepBeatPositions,
    input.callerExpectedTripleOffsetsBeats,
    "observedTripleStepBeatPositions",
  );
  if (input.observedTripleStepBeatPositions.length !== 3)
    simpleError("triple", "Exactly three measured cha-cha steps required.");
  strictlyIncreasing(input.observedTripleStepBeatPositions, "steps");
  sequence(input.callerExpectedTripleOffsetsBeats, "score");
  const offsets = input.observedTripleStepBeatPositions.map(
      (v) => v - input.callerTripleAnchorBeat,
    ),
    d = offsets.map((v, i) => v - input.callerExpectedTripleOffsetsBeats[i]);
  return {
    observedTripleOffsetsBeats: offsets,
    tripleStepPlacementDeviationsBeats: d,
    withinCallerTriplePlacement: d.every(
      (v) => Math.abs(v) <= input.callerPlacementToleranceBeats,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedTripleStepBeatPositions: [4, 4.5, 5],
  callerExpectedTripleOffsetsBeats: [0, 0.5, 1],
  callerTripleAnchorBeat: 4,
  callerPlacementToleranceBeats: 0.05,
} satisfies Input;
export const exampleOutput = {
  observedTripleOffsetsBeats: [0, 0.5, 1],
  tripleStepPlacementDeviationsBeats: [0, 0, 0],
  withinCallerTriplePlacement: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/cha-cha-triple-step-count-placement",
  title: "Cha Cha Triple Step Count Placement",
  description:
    "Audit actual three-step cha-cha placement against caller anchor and chosen subdivision score; no universal on-one/on-two convention, style identification or step technique.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedTripleOffsetsBeats",
      label: "Observed triple offsets beats",
      kind: "numberList",
    },
    {
      id: "tripleStepPlacementDeviationsBeats",
      label: "Triple step placement deviations beats",
      kind: "numberList",
    },
    {
      id: "withinCallerTriplePlacement",
      label: "Within caller triple placement",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observedTripleStepBeatPositions:
        value.observedTripleStepBeatPositions as readonly number[],
      callerExpectedTripleOffsetsBeats:
        value.callerExpectedTripleOffsetsBeats as readonly number[],
      callerTripleAnchorBeat: value.callerTripleAnchorBeat as number,
      callerPlacementToleranceBeats:
        value.callerPlacementToleranceBeats as number,
    }),
});
export const run = tool.execute;
export default tool;
