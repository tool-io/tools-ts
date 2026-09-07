import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, extrema } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedFluxDetunings: readonly number[];
  readonly observedTransitionSplittingHz: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedMinimumTunnelSplittingHz: number;
  readonly observedMinimumSplittingDetunings: readonly number[];
}>;
const inputFields = [
  {
    id: "observedFluxDetunings",
    label: "Observed flux detunings",
    kind: "numberList",
  },
  {
    id: "observedTransitionSplittingHz",
    label: "Observed transition splitting hz",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedTransitionSplittingHz.forEach((v) =>
    positive(v, "observedTransitionSplittingHz"),
  );
  const result = extrema(
    input.observedFluxDetunings,
    input.observedTransitionSplittingHz,
    false,
  );
  return {
    observedMinimumTunnelSplittingHz: result.value,
    observedMinimumSplittingDetunings: result.coordinates,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedFluxDetunings: [-1, 0, 1],
  observedTransitionSplittingHz: [3, 2, 3],
} satisfies Input;
export const exampleOutput = {
  observedMinimumTunnelSplittingHz: 2,
  observedMinimumSplittingDetunings: [0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/flux-qubit-tunelling-splitting",
  title: "Semiconductor Flux Qubit Tunelling Splitting Calculator",
  description:
    "Extract measured flux-qubit anticrossing minimum/tied detunings without assuming a complete unsampled Hamiltonian, tunnel coupling convention independently verified.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedMinimumTunnelSplittingHz",
      label: "Observed minimum tunnel splitting hz",
      kind: "number",
    },
    {
      id: "observedMinimumSplittingDetunings",
      label: "Observed minimum splitting detunings",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedFluxDetunings: value.observedFluxDetunings as readonly number[],
      observedTransitionSplittingHz:
        value.observedTransitionSplittingHz as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
