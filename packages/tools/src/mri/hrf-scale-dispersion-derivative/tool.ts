import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, ordered, hrf } from "../shared.js";
export type Input = Readonly<{
  readonly timesSeconds: readonly number[];
  readonly peakShape: number;
  readonly undershootShape: number;
  readonly scaleSeconds: number;
  readonly undershootRatio: number;
}>;
export type Output = Readonly<{
  readonly scaleDerivative: readonly number[];
}>;
const inputFields = [
  { id: "timesSeconds", label: "Times seconds", kind: "numberList", unit: "s" },
  { id: "peakShape", label: "Peak shape", kind: "integer" },
  { id: "undershootShape", label: "Undershoot shape", kind: "integer" },
  { id: "scaleSeconds", label: "Scale seconds", kind: "number", unit: "s" },
  { id: "undershootRatio", label: "Undershoot ratio", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  ordered(input.timesSeconds, "timesSeconds");
  hrf(
    input.timesSeconds,
    input.peakShape,
    input.undershootShape,
    input.scaleSeconds,
    input.undershootRatio,
  );
  const gamma = (t: number, k: number) => {
    if (t === 0) return k === 1 ? 1 / input.scaleSeconds : 0;
    let factorial = 1;
    for (let i = 2; i < k; i++) factorial *= i;
    return (
      ((t / input.scaleSeconds) ** (k - 1) *
        Math.exp(-t / input.scaleSeconds)) /
      (input.scaleSeconds * factorial)
    );
  };
  return {
    scaleDerivative: input.timesSeconds.map(
      (t) =>
        gamma(t, input.peakShape) *
          (t / input.scaleSeconds ** 2 - input.peakShape / input.scaleSeconds) -
        (gamma(t, input.undershootShape) *
          (t / input.scaleSeconds ** 2 -
            input.undershootShape / input.scaleSeconds)) /
          input.undershootRatio,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  timesSeconds: [0, 1, 2],
  peakShape: 2,
  undershootShape: 3,
  scaleSeconds: 1,
  undershootRatio: 6,
} satisfies Input;
export const exampleOutput = {
  scaleDerivative: [0, -0.30656620097620196, 0.045111761078870896],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/hrf-scale-dispersion-derivative",
  title: "Dispersion Derivative HRF",
  description:
    "Evaluate the analytic derivative of the caller double-gamma HRF with respect to its common scale parameter; this differs from time-shift differentiation and is not an orthogonalized design column.",
  inputs: inputFields,
  outputs: [
    { id: "scaleDerivative", label: "Scale derivative", kind: "numberList" },
  ],
  calculate: (value) =>
    calculate({
      timesSeconds: value.timesSeconds as readonly number[],
      peakShape: value.peakShape as number,
      undershootShape: value.undershootShape as number,
      scaleSeconds: value.scaleSeconds as number,
      undershootRatio: value.undershootRatio as number,
    }),
});
export const run = tool.execute;
export default tool;
