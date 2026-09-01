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
  bounded,
  probability,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedHits: number;
  readonly observedHomeRuns: number;
  readonly observedAtBats: number;
  readonly observedStrikeouts: number;
  readonly observedSacrificeFlies: number;
  readonly callerComparisonBabip: number;
}>;
export type Output = Readonly<{
  readonly observedBabip: number;
  readonly signedBabipMinusCallerReference: number;
}>;
const inputFields = [
  { id: "observedHits", label: "Observed hits", kind: "number" },
  { id: "observedHomeRuns", label: "Observed home runs", kind: "number" },
  { id: "observedAtBats", label: "Observed at bats", kind: "number" },
  { id: "observedStrikeouts", label: "Observed strikeouts", kind: "number" },
  {
    id: "observedSacrificeFlies",
    label: "Observed sacrifice flies",
    kind: "number",
  },
  {
    id: "callerComparisonBabip",
    label: "Caller comparison babip",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  [
    input.observedHits,
    input.observedHomeRuns,
    input.observedAtBats,
    input.observedStrikeouts,
    input.observedSacrificeFlies,
  ].forEach((v) => bounded(v, "count", 0, 1000000));
  probability(input.callerComparisonBabip);
  if (
    input.observedHomeRuns > input.observedHits ||
    input.observedHits + input.observedStrikeouts > input.observedAtBats
  )
    simpleError(
      "counts",
      "Mutually exclusive observed hits/strikeouts exceed at-bats.",
    );
  const balls =
    input.observedAtBats -
    input.observedStrikeouts -
    input.observedHomeRuns +
    input.observedSacrificeFlies;
  positive(balls, "ballsInPlay");
  const babip = (input.observedHits - input.observedHomeRuns) / balls;
  return {
    observedBabip: babip,
    signedBabipMinusCallerReference: babip - input.callerComparisonBabip,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedHits: 30,
  observedHomeRuns: 5,
  observedAtBats: 100,
  observedStrikeouts: 20,
  observedSacrificeFlies: 5,
  callerComparisonBabip: 0.3,
} satisfies Input;
export const exampleOutput = {
  observedBabip: 0.3125,
  signedBabipMinusCallerReference: 0.0125,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/baseball-babip-luck-checker",
  title: "BABIP Luck Checker",
  description:
    "Audit actual BABIP and explicit comparison rate, retaining signed difference; a discrepancy is not evidence of luck, causal regression or predictive skill.",
  inputs: inputFields,
  outputs: [
    { id: "observedBabip", label: "Observed babip", kind: "number" },
    {
      id: "signedBabipMinusCallerReference",
      label: "Signed babip minus caller reference",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedHits: value.observedHits as number,
      observedHomeRuns: value.observedHomeRuns as number,
      observedAtBats: value.observedAtBats as number,
      observedStrikeouts: value.observedStrikeouts as number,
      observedSacrificeFlies: value.observedSacrificeFlies as number,
      callerComparisonBabip: value.callerComparisonBabip as number,
    }),
});
export const run = tool.execute;
export default tool;
