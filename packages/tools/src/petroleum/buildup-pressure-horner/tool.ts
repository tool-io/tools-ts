import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, ordered } from "../batch37-shared.js";
export type Input = Readonly<{
  readonly callerFittedHornerInterceptPa: number;
  readonly callerFittedHornerLog10SlopePa: number;
  readonly observedPriorFlowDurationSeconds: number;
  readonly queryShutInSeconds: readonly number[];
  readonly callerVerifiedMinimumShutInSeconds: number;
  readonly callerVerifiedMaximumShutInSeconds: number;
}>;
export type Output = Readonly<{
  readonly callerHornerModelBuildupPressuresPa: readonly number[];
}>;
const inputFields = [
  {
    id: "callerFittedHornerInterceptPa",
    label: "Caller fitted horner intercept pa",
    kind: "number",
  },
  {
    id: "callerFittedHornerLog10SlopePa",
    label: "Caller fitted horner log10 slope pa",
    kind: "number",
  },
  {
    id: "observedPriorFlowDurationSeconds",
    label: "Observed prior flow duration seconds",
    kind: "number",
  },
  {
    id: "queryShutInSeconds",
    label: "Query shut in seconds",
    kind: "numberList",
  },
  {
    id: "callerVerifiedMinimumShutInSeconds",
    label: "Caller verified minimum shut in seconds",
    kind: "number",
  },
  {
    id: "callerVerifiedMaximumShutInSeconds",
    label: "Caller verified maximum shut in seconds",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.observedPriorFlowDurationSeconds,
    "observedPriorFlowDurationSeconds",
  );
  input.queryShutInSeconds.forEach((v) => positive(v, "queryShutInSeconds"));
  positive(
    input.callerVerifiedMinimumShutInSeconds,
    "callerVerifiedMinimumShutInSeconds",
  );
  positive(
    input.callerVerifiedMaximumShutInSeconds,
    "callerVerifiedMaximumShutInSeconds",
  );
  ordered(
    input.callerVerifiedMinimumShutInSeconds,
    input.callerVerifiedMaximumShutInSeconds,
  );
  return {
    callerHornerModelBuildupPressuresPa: input.queryShutInSeconds.map((t) => {
      if (
        t < input.callerVerifiedMinimumShutInSeconds ||
        t > input.callerVerifiedMaximumShutInSeconds
      )
        simpleError(
          "query",
          "No extrapolation beyond independently verified Horner shut-in branch.",
        );
      return (
        input.callerFittedHornerInterceptPa +
        (input.callerFittedHornerLog10SlopePa *
          Math.log1p(input.observedPriorFlowDurationSeconds / t)) /
          Math.LN10
      );
    }),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerFittedHornerInterceptPa: 30,
  callerFittedHornerLog10SlopePa: -10,
  observedPriorFlowDurationSeconds: 99,
  queryShutInSeconds: [1, 11],
  callerVerifiedMinimumShutInSeconds: 1,
  callerVerifiedMaximumShutInSeconds: 100,
} satisfies Input;
export const exampleOutput = {
  callerHornerModelBuildupPressuresPa: [10, 20],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "petroleum/buildup-pressure-horner",
  title: "Petroleum Buildup Pressure Horner Calculator",
  description:
    "Evaluate independently fitted bounded Horner pressure branch with explicit log10 units and prior-flow duration, not extracting fit from actual trace or forecasting outside validated regime. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerHornerModelBuildupPressuresPa",
      label: "Caller horner model buildup pressures pa",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerFittedHornerInterceptPa:
        value.callerFittedHornerInterceptPa as number,
      callerFittedHornerLog10SlopePa:
        value.callerFittedHornerLog10SlopePa as number,
      observedPriorFlowDurationSeconds:
        value.observedPriorFlowDurationSeconds as number,
      queryShutInSeconds: value.queryShutInSeconds as readonly number[],
      callerVerifiedMinimumShutInSeconds:
        value.callerVerifiedMinimumShutInSeconds as number,
      callerVerifiedMaximumShutInSeconds:
        value.callerVerifiedMaximumShutInSeconds as number,
    }),
});
export const run = tool.execute;
export default tool;
