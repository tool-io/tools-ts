import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  sum,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedGasRouteDropKpaBySegment: readonly number[];
  readonly observedUpstreamAbsoluteKpa: number;
  readonly callerMinimumDownstreamAbsoluteKpa: number;
}>;
export type Output = Readonly<{
  readonly totalObservedGasRouteDropKpa: number;
  readonly modeledDownstreamAbsoluteKpa: number;
  readonly signedDownstreamPressureMarginKpa: number;
}>;
const inputFields = [
  {
    id: "observedGasRouteDropKpaBySegment",
    label: "Observed gas route drop kpa by segment",
    kind: "numberList",
  },
  {
    id: "observedUpstreamAbsoluteKpa",
    label: "Observed upstream absolute kpa",
    kind: "number",
  },
  {
    id: "callerMinimumDownstreamAbsoluteKpa",
    label: "Caller minimum downstream absolute kpa",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedUpstreamAbsoluteKpa, "observedUpstreamAbsoluteKpa");
  positive(
    input.callerMinimumDownstreamAbsoluteKpa,
    "callerMinimumDownstreamAbsoluteKpa",
  );
  input.observedGasRouteDropKpaBySegment.forEach((v) =>
    nonnegative(v, "observedGasRouteDropKpaBySegment"),
  );
  if (!input.observedGasRouteDropKpaBySegment.length)
    simpleError("route", "Independent actual segment drops required.");
  const drop = sum(input.observedGasRouteDropKpaBySegment),
    down = input.observedUpstreamAbsoluteKpa - drop;
  positive(down, "absoluteDownstream");
  return {
    totalObservedGasRouteDropKpa: drop,
    modeledDownstreamAbsoluteKpa: down,
    signedDownstreamPressureMarginKpa:
      down - input.callerMinimumDownstreamAbsoluteKpa,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedGasRouteDropKpaBySegment: [0.1, 0.2, 0.3],
  observedUpstreamAbsoluteKpa: 110,
  callerMinimumDownstreamAbsoluteKpa: 109.5,
} satisfies Input;
export const exampleOutput = {
  totalObservedGasRouteDropKpa: 0.6,
  modeledDownstreamAbsoluteKpa: 109.4,
  signedDownstreamPressureMarginKpa: -0.1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/gas-pipe-pressure-drop",
  title: "Plumbing Gas Pipe Pressure Drop Calculator",
  description:
    "Reconcile actual independent gas-route segment pressure-drop observations and absolute boundary pressure, no guessed gas friction coefficient or single hydraulic formula, not gas installation approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "totalObservedGasRouteDropKpa",
      label: "Total observed gas route drop kpa",
      kind: "number",
    },
    {
      id: "modeledDownstreamAbsoluteKpa",
      label: "Modeled downstream absolute kpa",
      kind: "number",
    },
    {
      id: "signedDownstreamPressureMarginKpa",
      label: "Signed downstream pressure margin kpa",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedGasRouteDropKpaBySegment:
        value.observedGasRouteDropKpaBySegment as readonly number[],
      observedUpstreamAbsoluteKpa: value.observedUpstreamAbsoluteKpa as number,
      callerMinimumDownstreamAbsoluteKpa:
        value.callerMinimumDownstreamAbsoluteKpa as number,
    }),
});
export const run = tool.execute;
export default tool;
