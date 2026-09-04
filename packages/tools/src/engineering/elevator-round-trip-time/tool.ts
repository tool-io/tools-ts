import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedElevatorSegmentTravelSeconds: readonly number[];
  readonly observedMatchedStopServiceSeconds: readonly number[];
  readonly callerIndependentTerminalServiceSeconds: number;
}>;
export type Output = Readonly<{
  readonly observedElevatorRoundTripSeconds: number;
  readonly observedTravelShare: number;
}>;
const inputFields = [
  {
    id: "observedElevatorSegmentTravelSeconds",
    label: "Observed elevator segment travel seconds",
    kind: "numberList",
  },
  {
    id: "observedMatchedStopServiceSeconds",
    label: "Observed matched stop service seconds",
    kind: "numberList",
  },
  {
    id: "callerIndependentTerminalServiceSeconds",
    label: "Caller independent terminal service seconds",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedElevatorSegmentTravelSeconds.forEach((v) =>
    nonnegative(v, "observedElevatorSegmentTravelSeconds"),
  );
  input.observedMatchedStopServiceSeconds.forEach((v) =>
    nonnegative(v, "observedMatchedStopServiceSeconds"),
  );
  nonnegative(
    input.callerIndependentTerminalServiceSeconds,
    "callerIndependentTerminalServiceSeconds",
  );
  aligned(
    input.observedElevatorSegmentTravelSeconds,
    input.observedMatchedStopServiceSeconds,
    "observedElevatorSegmentTravelSeconds",
  );
  const travel = sum(input.observedElevatorSegmentTravelSeconds),
    total =
      travel +
      sum(input.observedMatchedStopServiceSeconds) +
      input.callerIndependentTerminalServiceSeconds;
  positive(total, "observed cycle");
  return {
    observedElevatorRoundTripSeconds: total,
    observedTravelShare: travel / total,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedElevatorSegmentTravelSeconds: [10, 20],
  observedMatchedStopServiceSeconds: [5, 6],
  callerIndependentTerminalServiceSeconds: 4,
} satisfies Input;
export const exampleOutput = {
  observedElevatorRoundTripSeconds: 45,
  observedTravelShare: 0.6666666666666666,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/elevator-round-trip-time",
  title: "Elevator Round-Trip Time Calculator",
  description:
    "Reconcile actual whole round-trip segment travel/stop/terminal clocks, not forecast traffic equivalents or ignoring dwell. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedElevatorRoundTripSeconds",
      label: "Observed elevator round trip seconds",
      kind: "number",
    },
    {
      id: "observedTravelShare",
      label: "Observed travel share",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedElevatorSegmentTravelSeconds:
        value.observedElevatorSegmentTravelSeconds as readonly number[],
      observedMatchedStopServiceSeconds:
        value.observedMatchedStopServiceSeconds as readonly number[],
      callerIndependentTerminalServiceSeconds:
        value.callerIndependentTerminalServiceSeconds as number,
    }),
});
export const run = tool.execute;
export default tool;
