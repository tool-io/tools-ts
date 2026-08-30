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
  ordered,
  regression,
} from "../shared.js";
export type Input = Readonly<{
  readonly echoTimesMs: readonly number[];
  readonly signalMagnitudes: readonly number[];
}>;
export type Output = Readonly<{
  readonly r2StarPerSecond: number;
  readonly t2StarMs: number;
  readonly extrapolatedSignalAtZero: number;
  readonly logFitRSquared: number;
}>;
const inputFields = [
  { id: "echoTimesMs", label: "Echo times ms", kind: "numberList" },
  { id: "signalMagnitudes", label: "Signal magnitudes", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  ordered(input.echoTimesMs, "echoTimesMs");
  input.echoTimesMs.forEach((v) => nonnegative(v, "echoTimesMs"));
  input.signalMagnitudes.forEach((v) => positive(v, "signalMagnitudes"));
  const fit = regression(
    input.echoTimesMs,
    input.signalMagnitudes.map(Math.log),
  );
  if (fit.slope >= 0)
    simpleError(
      "signalMagnitudes",
      "A decaying positive multi-echo signal required.",
    );
  return {
    r2StarPerSecond: -1000 * fit.slope,
    t2StarMs: -1 / fit.slope,
    extrapolatedSignalAtZero: Math.exp(fit.intercept),
    logFitRSquared: fit.rSquared,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  echoTimesMs: [0, 10, 20],
  signalMagnitudes: [100, 36.787944117144235, 13.53352832366127],
} satisfies Input;
export const exampleOutput = {
  r2StarPerSecond: 100,
  t2StarMs: 10,
  extrapolatedSignalAtZero: 100,
  logFitRSquared: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/multi-echo-r2star-fit",
  title: "Iron Deposition R2*",
  description:
    "Fit monoexponential multi-echo magnitude decay in log space and derive R2*; no conversion to iron concentration is inferred and magnitude noise can bias the fit.",
  inputs: inputFields,
  outputs: [
    { id: "r2StarPerSecond", label: "R2 star per second", kind: "number" },
    { id: "t2StarMs", label: "T2 star ms", kind: "number" },
    {
      id: "extrapolatedSignalAtZero",
      label: "Extrapolated signal at zero",
      kind: "number",
    },
    { id: "logFitRSquared", label: "Log fit r squared", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      echoTimesMs: value.echoTimesMs as readonly number[],
      signalMagnitudes: value.signalMagnitudes as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
