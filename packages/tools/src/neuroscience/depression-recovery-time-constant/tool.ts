import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
  aligned,
  ordered,
  regression,
} from "../shared.js";
export type Input = Readonly<{
  readonly recoveryIntervalsMs: readonly number[];
  readonly recoveryFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly recoveryTauMs: number;
  readonly logDeficitIntercept: number;
  readonly fitRSquared: number;
}>;
const inputFields = [
  {
    id: "recoveryIntervalsMs",
    label: "Recovery intervals ms",
    kind: "numberList",
  },
  { id: "recoveryFractions", label: "Recovery fractions", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  ordered(input.recoveryIntervalsMs, "recoveryIntervalsMs");
  input.recoveryIntervalsMs.forEach((v) =>
    nonnegative(v, "recoveryIntervalsMs"),
  );
  aligned(
    input.recoveryIntervalsMs,
    input.recoveryFractions,
    "recoveryIntervalsMs",
  );
  input.recoveryFractions.forEach((v) => {
    fraction(v, "recoveryFractions");
    if (v === 1)
      simpleError(
        "recoveryFractions",
        "Recovery fractions strictly below one required for log-deficit fitting.",
      );
  });
  const fit = regression(
    input.recoveryIntervalsMs,
    input.recoveryFractions.map((v) => Math.log1p(-v)),
  );
  if (fit.slope >= 0)
    simpleError(
      "recoveryFractions",
      "A decreasing log deficit required for finite recovery tau.",
    );
  return {
    recoveryTauMs: -1 / fit.slope,
    logDeficitIntercept: fit.intercept,
    fitRSquared: fit.rSquared,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  recoveryIntervalsMs: [0, 10, 20],
  recoveryFractions: [0, 0.6321205588285577, 0.8646647167633873],
} satisfies Input;
export const exampleOutput = {
  recoveryTauMs: 10,
  logDeficitIntercept: 0,
  fitRSquared: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/depression-recovery-time-constant",
  title: "Recovery Time Constant Depression",
  description:
    "Fit log(1−recovered fraction) against recovery interval to estimate exponential recovery tau; this model assumes an asymptotic recovery fraction of one.",
  inputs: inputFields,
  outputs: [
    { id: "recoveryTauMs", label: "Recovery tau ms", kind: "number" },
    {
      id: "logDeficitIntercept",
      label: "Log deficit intercept",
      kind: "number",
    },
    { id: "fitRSquared", label: "Fit r squared", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      recoveryIntervalsMs: value.recoveryIntervalsMs as readonly number[],
      recoveryFractions: value.recoveryFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
