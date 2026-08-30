import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, recoveryFit } from "../shared.js";
export type Input = Readonly<{
  readonly timesMinutes: readonly number[];
  readonly recoveryFractions: readonly number[];
  readonly ultimateRecovery: number;
}>;
export type Output = Readonly<{
  readonly fittedRatePerMinute: number;
  readonly logResidualIntercept: number;
  readonly fitRSquared: number;
}>;
const inputFields = [
  { id: "timesMinutes", label: "Times minutes", kind: "numberList" },
  { id: "recoveryFractions", label: "Recovery fractions", kind: "numberList" },
  { id: "ultimateRecovery", label: "Ultimate recovery", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const fit = recoveryFit(
    input.timesMinutes,
    input.recoveryFractions,
    input.ultimateRecovery,
  );
  return {
    fittedRatePerMinute: fit.rate,
    logResidualIntercept: fit.intercept,
    fitRSquared: fit.rSquared,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  timesMinutes: [0, 1, 2],
  recoveryFractions: [0, 0.31477547222989327, 0.5056964470628461],
  ultimateRecovery: 0.8,
} satisfies Input;
export const exampleOutput = {
  fittedRatePerMinute: 0.5,
  logResidualIntercept: 0,
  fitRSquared: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/flotation-kinetics-rate",
  title: "Flotation Kinetics Rate",
  description:
    "Fit log residual recovery against time with caller ultimate flotation recovery; intercept is estimated and no asymptote is invented.",
  inputs: inputFields,
  outputs: [
    {
      id: "fittedRatePerMinute",
      label: "Fitted rate per minute",
      kind: "number",
    },
    {
      id: "logResidualIntercept",
      label: "Log residual intercept",
      kind: "number",
    },
    { id: "fitRSquared", label: "Fit r squared", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      timesMinutes: value.timesMinutes as readonly number[],
      recoveryFractions: value.recoveryFractions as readonly number[],
      ultimateRecovery: value.ultimateRecovery as number,
    }),
});
export const run = tool.execute;
export default tool;
