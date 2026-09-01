import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  aligned,
  sum,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedRunsScored: readonly number[];
  readonly callerEffectiveFacedLegalBalls: readonly number[];
  readonly observedRunsConceded: readonly number[];
  readonly callerEffectiveBowledLegalBalls: readonly number[];
}>;
export type Output = Readonly<{
  readonly pooledScoringRunsPerOver: number;
  readonly pooledConcedingRunsPerOver: number;
  readonly netRunRate: number;
}>;
const inputFields = [
  {
    id: "observedRunsScored",
    label: "Observed runs scored",
    kind: "numberList",
  },
  {
    id: "callerEffectiveFacedLegalBalls",
    label: "Caller effective faced legal balls",
    kind: "numberList",
  },
  {
    id: "observedRunsConceded",
    label: "Observed runs conceded",
    kind: "numberList",
  },
  {
    id: "callerEffectiveBowledLegalBalls",
    label: "Caller effective bowled legal balls",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedRunsScored,
    input.callerEffectiveFacedLegalBalls,
    "matches",
  );
  aligned(
    input.observedRunsConceded,
    input.callerEffectiveBowledLegalBalls,
    "matches",
  );
  aligned(input.observedRunsScored, input.observedRunsConceded, "matches");
  [...input.observedRunsScored, ...input.observedRunsConceded].forEach((v) =>
    bounded(v, "runs", 0, 1000000),
  );
  [
    ...input.callerEffectiveFacedLegalBalls,
    ...input.callerEffectiveBowledLegalBalls,
  ].forEach((v) => bounded(v, "balls", 1, 1000000));
  const scored =
      (6 * sum(input.observedRunsScored)) /
      sum(input.callerEffectiveFacedLegalBalls),
    conceded =
      (6 * sum(input.observedRunsConceded)) /
      sum(input.callerEffectiveBowledLegalBalls);
  return {
    pooledScoringRunsPerOver: scored,
    pooledConcedingRunsPerOver: conceded,
    netRunRate: scored - conceded,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedRunsScored: [100, 200],
  callerEffectiveFacedLegalBalls: [60, 120],
  observedRunsConceded: [120, 150],
  callerEffectiveBowledLegalBalls: [60, 120],
} satisfies Input;
export const exampleOutput = {
  pooledScoringRunsPerOver: 10,
  pooledConcedingRunsPerOver: 9,
  netRunRate: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/cricket-net-run-rate-nrr-team",
  title: "Team Net Run Rate Calculator",
  description:
    "Pool actual cricket runs/effective legal-ball denominators across matches; caller resolves all-out quota/DLS exclusions, not average match NRR or decimal over notation.",
  inputs: inputFields,
  outputs: [
    {
      id: "pooledScoringRunsPerOver",
      label: "Pooled scoring runs per over",
      kind: "number",
    },
    {
      id: "pooledConcedingRunsPerOver",
      label: "Pooled conceding runs per over",
      kind: "number",
    },
    { id: "netRunRate", label: "Net run rate", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      observedRunsScored: value.observedRunsScored as readonly number[],
      callerEffectiveFacedLegalBalls:
        value.callerEffectiveFacedLegalBalls as readonly number[],
      observedRunsConceded: value.observedRunsConceded as readonly number[],
      callerEffectiveBowledLegalBalls:
        value.callerEffectiveBowledLegalBalls as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
