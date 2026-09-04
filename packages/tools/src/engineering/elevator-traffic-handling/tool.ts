import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly callerObservedRoundTripSeconds: number;
  readonly callerUsableCarPassengers: number;
  readonly callerAvailableCars: number;
  readonly callerPeakIntervalSeconds: number;
}>;
export type Output = Readonly<{
  readonly intervalHandlingPassengerEquivalent: number;
}>;
const inputFields = [
  {
    id: "callerObservedRoundTripSeconds",
    label: "Caller observed round trip seconds",
    kind: "number",
  },
  {
    id: "callerUsableCarPassengers",
    label: "Caller usable car passengers",
    kind: "number",
  },
  { id: "callerAvailableCars", label: "Caller available cars", kind: "number" },
  {
    id: "callerPeakIntervalSeconds",
    label: "Caller peak interval seconds",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerObservedRoundTripSeconds,
    "callerObservedRoundTripSeconds",
  );
  nonnegative(input.callerUsableCarPassengers, "callerUsableCarPassengers");
  nonnegative(input.callerAvailableCars, "callerAvailableCars");
  nonnegative(input.callerPeakIntervalSeconds, "callerPeakIntervalSeconds");
  return {
    intervalHandlingPassengerEquivalent:
      (input.callerUsableCarPassengers *
        input.callerAvailableCars *
        input.callerPeakIntervalSeconds) /
      input.callerObservedRoundTripSeconds,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerObservedRoundTripSeconds: 120,
  callerUsableCarPassengers: 10,
  callerAvailableCars: 3,
  callerPeakIntervalSeconds: 300,
} satisfies Input;
export const exampleOutput = {
  intervalHandlingPassengerEquivalent: 75,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/elevator-traffic-handling",
  title: "Elevator Traffic Handling Calculator",
  description:
    "Observed elevator fleet service equivalents over caller peak interval, fractional equivalents not actual boarded people or lift code capacity. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "intervalHandlingPassengerEquivalent",
      label: "Interval handling passenger equivalent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerObservedRoundTripSeconds:
        value.callerObservedRoundTripSeconds as number,
      callerUsableCarPassengers: value.callerUsableCarPassengers as number,
      callerAvailableCars: value.callerAvailableCars as number,
      callerPeakIntervalSeconds: value.callerPeakIntervalSeconds as number,
    }),
});
export const run = tool.execute;
export default tool;
