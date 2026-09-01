import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerTargetRuns: number;
  readonly observedCurrentRuns: number;
  readonly observedRemainingLegalBalls: number;
}>;
export type Output = Readonly<{
  readonly runsNeededToReachTarget: number;
  readonly requiredRunsPerSixBallOver: number;
}>;
const inputFields = [
  { id: "callerTargetRuns", label: "Caller target runs", kind: "number" },
  { id: "observedCurrentRuns", label: "Observed current runs", kind: "number" },
  {
    id: "observedRemainingLegalBalls",
    label: "Observed remaining legal balls",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.callerTargetRuns, "target", 1, 1000000);
  bounded(input.observedCurrentRuns, "runs", 0, 1000000);
  bounded(input.observedRemainingLegalBalls, "balls", 1, 1000000);
  const need = Math.max(0, input.callerTargetRuns - input.observedCurrentRuns);
  return {
    runsNeededToReachTarget: need,
    requiredRunsPerSixBallOver: (need * 6) / input.observedRemainingLegalBalls,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerTargetRuns: 201,
  observedCurrentRuns: 100,
  observedRemainingLegalBalls: 60,
} satisfies Input;
export const exampleOutput = {
  runsNeededToReachTarget: 101,
  requiredRunsPerSixBallOver: 10.1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/cricket-run-rate-required-chase",
  title: "Required Run Rate Chase Calculator",
  description:
    "Budget actual cricket chase legal balls to caller winning target (already includes winning run), overs six legal balls not decimal notation; wickets/extras/DLS excluded.",
  inputs: inputFields,
  outputs: [
    {
      id: "runsNeededToReachTarget",
      label: "Runs needed to reach target",
      kind: "number",
    },
    {
      id: "requiredRunsPerSixBallOver",
      label: "Required runs per six ball over",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerTargetRuns: value.callerTargetRuns as number,
      observedCurrentRuns: value.observedCurrentRuns as number,
      observedRemainingLegalBalls: value.observedRemainingLegalBalls as number,
    }),
});
export const run = tool.execute;
export default tool;
