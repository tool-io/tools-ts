import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, aligned } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedDonorHyperfineUpperHz: readonly number[];
  readonly observedDonorHyperfineLowerHz: readonly number[];
  readonly callerIndependentlyAssignedDeltaM: readonly number[];
}>;
export type Output = Readonly<{
  readonly inferredDonorHyperfineCouplingHz: readonly number[];
}>;
const inputFields = [
  {
    id: "observedDonorHyperfineUpperHz",
    label: "Observed donor hyperfine upper hz",
    kind: "numberList",
  },
  {
    id: "observedDonorHyperfineLowerHz",
    label: "Observed donor hyperfine lower hz",
    kind: "numberList",
  },
  {
    id: "callerIndependentlyAssignedDeltaM",
    label: "Caller independently assigned delta m",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerIndependentlyAssignedDeltaM.forEach((v) =>
    positive(v, "callerIndependentlyAssignedDeltaM"),
  );
  aligned(
    input.observedDonorHyperfineUpperHz,
    input.observedDonorHyperfineLowerHz,
    "observedDonorHyperfineUpperHz",
  );
  aligned(
    input.observedDonorHyperfineUpperHz,
    input.callerIndependentlyAssignedDeltaM,
    "observedDonorHyperfineUpperHz",
  );
  return {
    inferredDonorHyperfineCouplingHz: input.observedDonorHyperfineUpperHz.map(
      (v, i) =>
        (v - input.observedDonorHyperfineLowerHz[i]) /
        input.callerIndependentlyAssignedDeltaM[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDonorHyperfineUpperHz: [100, 200],
  observedDonorHyperfineLowerHz: [90, 180],
  callerIndependentlyAssignedDeltaM: [1, 2],
} satisfies Input;
export const exampleOutput = {
  inferredDonorHyperfineCouplingHz: [10, 10],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/donor-qubit-hyperfine-interaction",
  title: "Semiconductor Donor Qubit Hyperfine Interaction Calculator",
  description:
    "Infer donor hyperfine spacing from independently assigned spectral transitions and explicit Δm, retain signed assignments; no donor-specific constant or automatic level identification.",
  inputs: inputFields,
  outputs: [
    {
      id: "inferredDonorHyperfineCouplingHz",
      label: "Inferred donor hyperfine coupling hz",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDonorHyperfineUpperHz:
        value.observedDonorHyperfineUpperHz as readonly number[],
      observedDonorHyperfineLowerHz:
        value.observedDonorHyperfineLowerHz as readonly number[],
      callerIndependentlyAssignedDeltaM:
        value.callerIndependentlyAssignedDeltaM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
