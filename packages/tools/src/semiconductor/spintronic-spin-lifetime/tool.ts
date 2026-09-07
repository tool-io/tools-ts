import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, aligned } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedSpinDiffusionLengthsM: readonly number[];
  readonly callerMatchedSpinDiffusivitiesM2Second: readonly number[];
}>;
export type Output = Readonly<{
  readonly inferredSpinLifetimesSeconds: readonly number[];
}>;
const inputFields = [
  {
    id: "observedSpinDiffusionLengthsM",
    label: "Observed spin diffusion lengths m",
    kind: "numberList",
  },
  {
    id: "callerMatchedSpinDiffusivitiesM2Second",
    label: "Caller matched spin diffusivities m2 second",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedSpinDiffusionLengthsM.forEach((v) =>
    positive(v, "observedSpinDiffusionLengthsM"),
  );
  input.callerMatchedSpinDiffusivitiesM2Second.forEach((v) =>
    positive(v, "callerMatchedSpinDiffusivitiesM2Second"),
  );
  aligned(
    input.observedSpinDiffusionLengthsM,
    input.callerMatchedSpinDiffusivitiesM2Second,
    "observedSpinDiffusionLengthsM",
  );
  return {
    inferredSpinLifetimesSeconds: input.observedSpinDiffusionLengthsM.map(
      (v, i) => v ** 2 / input.callerMatchedSpinDiffusivitiesM2Second[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSpinDiffusionLengthsM: [2, 3],
  callerMatchedSpinDiffusivitiesM2Second: [1, 3],
} satisfies Input;
export const exampleOutput = {
  inferredSpinLifetimesSeconds: [4, 3],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/spintronic-spin-lifetime",
  title: "Semiconductor Spintronic Spin Lifetime Calculator",
  description:
    "Infer matched spin relaxation times from independently measured diffusion lengths/diffusivities λ²/D, distinct from spatial signal-fit length or momentum scattering lifetime.",
  inputs: inputFields,
  outputs: [
    {
      id: "inferredSpinLifetimesSeconds",
      label: "Inferred spin lifetimes seconds",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSpinDiffusionLengthsM:
        value.observedSpinDiffusionLengthsM as readonly number[],
      callerMatchedSpinDiffusivitiesM2Second:
        value.callerMatchedSpinDiffusivitiesM2Second as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
