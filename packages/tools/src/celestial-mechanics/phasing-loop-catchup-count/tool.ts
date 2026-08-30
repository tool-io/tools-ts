import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive, nonnegative, count } from "../shared.js";

export type Input = Readonly<{
  readonly initialPhaseDegrees: number;
  readonly phaseAdvanceDegreesPerLoop: number;
  readonly loopPeriod: number;
}>;
export type Output = Readonly<{
  readonly continuousLoops: number;
  readonly wholeLoopsToPassTarget: number;
  readonly phaseOvershootDegrees: number;
  readonly elapsedToPassTarget: number;
}>;
export const calculate = (input: Input): Output => {
  nonnegative(input.initialPhaseDegrees, "initialPhaseDegrees");
  positive(input.phaseAdvanceDegreesPerLoop, "phaseAdvanceDegreesPerLoop");
  positive(input.loopPeriod, "loopPeriod");
  if (
    input.initialPhaseDegrees >= 360 ||
    input.phaseAdvanceDegreesPerLoop > 360
  )
    simpleError(
      "initialPhaseDegrees",
      "Initial phase must be below one turn and per-loop advance at most one turn.",
    );
  const continuousLoops =
      input.initialPhaseDegrees / input.phaseAdvanceDegreesPerLoop,
    wholeLoopsToPassTarget = Math.ceil(continuousLoops);
  count(wholeLoopsToPassTarget, "phaseAdvanceDegreesPerLoop");
  return {
    continuousLoops,
    wholeLoopsToPassTarget,
    phaseOvershootDegrees:
      wholeLoopsToPassTarget * input.phaseAdvanceDegreesPerLoop -
      input.initialPhaseDegrees,
    elapsedToPassTarget: wholeLoopsToPassTarget * input.loopPeriod,
  };
};
export const exampleInput = {
  initialPhaseDegrees: 90,
  phaseAdvanceDegreesPerLoop: 30,
  loopPeriod: 50,
} satisfies Input;
export const exampleOutput = {
  continuousLoops: 3,
  wholeLoopsToPassTarget: 3,
  phaseOvershootDegrees: 0,
  elapsedToPassTarget: 150,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/phasing-loop-catchup-count",
  title: "Phasing Loop Catchup Count",
  description:
    "Estimate loops to pass a target phase under constant per-loop advance; overshoot is reported rather than claiming exact rendezvous.",
  inputs: [
    {
      id: "initialPhaseDegrees",
      label: "Initial phase degrees",
      kind: "number",
    },
    {
      id: "phaseAdvanceDegreesPerLoop",
      label: "Phase advance degrees per loop",
      kind: "number",
    },
    { id: "loopPeriod", label: "Loop period", kind: "number" },
  ],
  outputs: [
    { id: "continuousLoops", label: "Continuous loops", kind: "number" },
    {
      id: "wholeLoopsToPassTarget",
      label: "Whole loops to pass target",
      kind: "number",
    },
    {
      id: "phaseOvershootDegrees",
      label: "Phase overshoot degrees",
      kind: "number",
    },
    {
      id: "elapsedToPassTarget",
      label: "Elapsed to pass target",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      initialPhaseDegrees: value.initialPhaseDegrees as number,
      phaseAdvanceDegreesPerLoop: value.phaseAdvanceDegreesPerLoop as number,
      loopPeriod: value.loopPeriod as number,
    }),
});
export const run = tool.execute;
export default tool;
