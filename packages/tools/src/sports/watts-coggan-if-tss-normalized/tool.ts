import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
  weights,
  finite,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedAlreadyRolling30SecondPowerWatts: readonly number[];
  readonly representedDurationsSeconds: readonly number[];
  readonly independentlyMeasuredFtpWatts: number;
}>;
export type Output = Readonly<{
  readonly normalizedPowerWatts: number;
  readonly intensityFactor: number;
  readonly modeledTrainingStressScore: number;
}>;
const inputFields = [
  {
    id: "observedAlreadyRolling30SecondPowerWatts",
    label: "Observed rolling 30-second power watts",
    kind: "numberList",
  },
  {
    id: "representedDurationsSeconds",
    label: "Represented durations seconds",
    kind: "numberList",
  },
  {
    id: "independentlyMeasuredFtpWatts",
    label: "Independently measured ftp watts",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.representedDurationsSeconds.forEach((v) =>
    positive(v, "representedDurationsSeconds"),
  );
  positive(
    input.independentlyMeasuredFtpWatts,
    "independentlyMeasuredFtpWatts",
  );
  input.observedAlreadyRolling30SecondPowerWatts.forEach((v) =>
    nonnegative(v, "observedAlreadyRolling30SecondPowerWatts"),
  );
  aligned(
    input.observedAlreadyRolling30SecondPowerWatts,
    input.representedDurationsSeconds,
    "observedAlreadyRolling30SecondPowerWatts",
  );
  const w = weights(input.representedDurationsSeconds),
    fourth = sum(
      input.observedAlreadyRolling30SecondPowerWatts.map(
        (v, i) => finite(v ** 4) * w[i],
      ),
    ),
    np = fourth ** 0.25,
    ifactor = np / input.independentlyMeasuredFtpWatts;
  return {
    normalizedPowerWatts: np,
    intensityFactor: ifactor,
    modeledTrainingStressScore:
      (sum(input.representedDurationsSeconds) / 3600) * ifactor * ifactor * 100,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedAlreadyRolling30SecondPowerWatts: [100, 200],
  representedDurationsSeconds: [30, 30],
  independentlyMeasuredFtpWatts: 200,
} satisfies Input;
export const exampleOutput = {
  normalizedPowerWatts: 170.74764851741443,
  intensityFactor: 0.8537382425870722,
  modeledTrainingStressScore: 1.2147816447594377,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/watts-coggan-if-tss-normalized",
  title: "Coggan IF/TSS Normalized Power Calculator",
  description:
    "Compute fourth-power time-weighted NP/IF/TSS from caller already 30-second-rolling power observations; no invented raw-series smoothing or acute readiness/injury score.",
  inputs: inputFields,
  outputs: [
    {
      id: "normalizedPowerWatts",
      label: "Normalized power watts",
      kind: "number",
    },
    { id: "intensityFactor", label: "Intensity factor", kind: "number" },
    {
      id: "modeledTrainingStressScore",
      label: "Modeled training stress score",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedAlreadyRolling30SecondPowerWatts:
        value.observedAlreadyRolling30SecondPowerWatts as readonly number[],
      representedDurationsSeconds:
        value.representedDurationsSeconds as readonly number[],
      independentlyMeasuredFtpWatts:
        value.independentlyMeasuredFtpWatts as number,
    }),
});
export const run = tool.execute;
export default tool;
