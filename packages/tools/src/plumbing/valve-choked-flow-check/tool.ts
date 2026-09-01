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
  fraction,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedUpstreamAbsoluteKpa: number;
  readonly observedDownstreamAbsoluteKpa: number;
  readonly callerVaporAbsoluteKpa: number;
  readonly callerCriticalAbsoluteKpa: number;
  readonly callerLiquidRecoveryFactor: number;
}>;
export type Output = Readonly<{
  readonly modeledLiquidChokedDropThresholdKpa: number;
  readonly observedValveDropKpa: number;
  readonly callerLiquidChokedCriterionReached: boolean;
}>;
const inputFields = [
  {
    id: "observedUpstreamAbsoluteKpa",
    label: "Observed upstream absolute kpa",
    kind: "number",
  },
  {
    id: "observedDownstreamAbsoluteKpa",
    label: "Observed downstream absolute kpa",
    kind: "number",
  },
  {
    id: "callerVaporAbsoluteKpa",
    label: "Caller vapor absolute kpa",
    kind: "number",
  },
  {
    id: "callerCriticalAbsoluteKpa",
    label: "Caller critical absolute kpa",
    kind: "number",
  },
  {
    id: "callerLiquidRecoveryFactor",
    label: "Caller liquid recovery factor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedUpstreamAbsoluteKpa, "observedUpstreamAbsoluteKpa");
  positive(
    input.observedDownstreamAbsoluteKpa,
    "observedDownstreamAbsoluteKpa",
  );
  positive(input.callerCriticalAbsoluteKpa, "callerCriticalAbsoluteKpa");
  positive(input.callerLiquidRecoveryFactor, "callerLiquidRecoveryFactor");
  nonnegative(input.callerVaporAbsoluteKpa, "callerVaporAbsoluteKpa");
  fraction(input.callerLiquidRecoveryFactor, "callerLiquidRecoveryFactor");
  if (
    input.callerVaporAbsoluteKpa > input.callerCriticalAbsoluteKpa ||
    input.observedDownstreamAbsoluteKpa > input.observedUpstreamAbsoluteKpa
  )
    simpleError("pressures", "Liquid branch Pv≤Pc and P2≤P1 required.");
  const ff =
      0.96 -
      0.28 *
        Math.sqrt(
          input.callerVaporAbsoluteKpa / input.callerCriticalAbsoluteKpa,
        ),
    threshold =
      input.callerLiquidRecoveryFactor ** 2 *
      (input.observedUpstreamAbsoluteKpa - ff * input.callerVaporAbsoluteKpa);
  positive(threshold, "threshold");
  const drop =
    input.observedUpstreamAbsoluteKpa - input.observedDownstreamAbsoluteKpa;
  return {
    modeledLiquidChokedDropThresholdKpa: threshold,
    observedValveDropKpa: drop,
    callerLiquidChokedCriterionReached: drop >= threshold,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedUpstreamAbsoluteKpa: 200,
  observedDownstreamAbsoluteKpa: 100,
  callerVaporAbsoluteKpa: 10,
  callerCriticalAbsoluteKpa: 1000,
  callerLiquidRecoveryFactor: 0.8,
} satisfies Input;
export const exampleOutput = {
  modeledLiquidChokedDropThresholdKpa: 122.0352,
  observedValveDropKpa: 100,
  callerLiquidChokedCriterionReached: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/valve-choked-flow-check",
  title: "Plumbing Valve Choked Flow Check Calculator",
  description:
    "Audit actual liquid valve drop against explicit caller FL and FF=.96−.28√(Pv/Pc) threshold, absolute pressures; excludes gases/two-phase flow, no valve-operating or pressure safety approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledLiquidChokedDropThresholdKpa",
      label: "Modeled liquid choked drop threshold kpa",
      kind: "number",
    },
    {
      id: "observedValveDropKpa",
      label: "Observed valve drop kpa",
      kind: "number",
    },
    {
      id: "callerLiquidChokedCriterionReached",
      label: "Caller liquid choked criterion reached",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observedUpstreamAbsoluteKpa: value.observedUpstreamAbsoluteKpa as number,
      observedDownstreamAbsoluteKpa:
        value.observedDownstreamAbsoluteKpa as number,
      callerVaporAbsoluteKpa: value.callerVaporAbsoluteKpa as number,
      callerCriticalAbsoluteKpa: value.callerCriticalAbsoluteKpa as number,
      callerLiquidRecoveryFactor: value.callerLiquidRecoveryFactor as number,
    }),
});
export const run = tool.execute;
export default tool;
