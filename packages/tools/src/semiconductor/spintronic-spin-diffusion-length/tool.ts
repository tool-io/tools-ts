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
  linearFit,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedSpinDistancesM: readonly number[];
  readonly observedSpinSignal: readonly number[];
}>;
export type Output = Readonly<{
  readonly fittedSpinDiffusionLengthM: number;
  readonly spinFitRSquared: number;
}>;
const inputFields = [
  {
    id: "observedSpinDistancesM",
    label: "Observed spin distances m",
    kind: "numberList",
  },
  {
    id: "observedSpinSignal",
    label: "Observed spin signal",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedSpinSignal.forEach((v) => positive(v, "observedSpinSignal"));
  const fit = linearFit(
    input.observedSpinDistancesM,
    input.observedSpinSignal.map(Math.log),
  );
  if (fit.slope >= 0)
    simpleError(
      "decay",
      "Decreasing independently verified spin-diffusion spatial signal required.",
    );
  return {
    fittedSpinDiffusionLengthM: -1 / fit.slope,
    spinFitRSquared: fit.rSquared,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSpinDistancesM: [0, 1, 2],
  observedSpinSignal: [4, 2, 1],
} satisfies Input;
export const exampleOutput = {
  fittedSpinDiffusionLengthM: 1.4426950408889634,
  spinFitRSquared: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/spintronic-spin-diffusion-length",
  title: "Semiconductor Spintronic Spin Diffusion Length Calculator",
  description:
    "Extract spin diffusion length from actual spatial spin-specific signal decay, not generic mobility mean-free-path or assumed spin lifetime; caller verifies transport branch.",
  inputs: inputFields,
  outputs: [
    {
      id: "fittedSpinDiffusionLengthM",
      label: "Fitted spin diffusion length m",
      kind: "number",
    },
    { id: "spinFitRSquared", label: "Spin fit r squared", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      observedSpinDistancesM: value.observedSpinDistancesM as readonly number[],
      observedSpinSignal: value.observedSpinSignal as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
