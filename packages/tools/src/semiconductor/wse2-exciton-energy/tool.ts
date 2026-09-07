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
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly callerWse2QuasiparticleGapEv: number;
  readonly callerMatchedWse2ExcitonBindingEv: number;
  readonly observedWse2ExcitonPeakEv: number;
}>;
export type Output = Readonly<{
  readonly modeledWse2ExcitonTransitionEv: number;
  readonly signedExcitonPeakDifferenceEv: number;
}>;
const inputFields = [
  {
    id: "callerWse2QuasiparticleGapEv",
    label: "Caller wse2 quasiparticle gap ev",
    kind: "number",
  },
  {
    id: "callerMatchedWse2ExcitonBindingEv",
    label: "Caller matched wse2 exciton binding ev",
    kind: "number",
  },
  {
    id: "observedWse2ExcitonPeakEv",
    label: "Observed wse2 exciton peak ev",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerWse2QuasiparticleGapEv, "callerWse2QuasiparticleGapEv");
  nonnegative(
    input.callerMatchedWse2ExcitonBindingEv,
    "callerMatchedWse2ExcitonBindingEv",
  );
  nonnegative(input.observedWse2ExcitonPeakEv, "observedWse2ExcitonPeakEv");
  if (
    input.callerMatchedWse2ExcitonBindingEv >=
    input.callerWse2QuasiparticleGapEv
  )
    simpleError("binding", "Binding below matched quasiparticle gap required.");
  const energy =
    input.callerWse2QuasiparticleGapEv -
    input.callerMatchedWse2ExcitonBindingEv;
  return {
    modeledWse2ExcitonTransitionEv: energy,
    signedExcitonPeakDifferenceEv: input.observedWse2ExcitonPeakEv - energy,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerWse2QuasiparticleGapEv: 2,
  callerMatchedWse2ExcitonBindingEv: 0.4,
  observedWse2ExcitonPeakEv: 1.7,
} satisfies Input;
export const exampleOutput = {
  modeledWse2ExcitonTransitionEv: 1.6,
  signedExcitonPeakDifferenceEv: 0.1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/wse2-exciton-energy",
  title: "Semiconductor Wse2 Exciton Energy Calculator",
  description:
    "Budget independently measured WSe2 quasiparticle/binding energies against actual optical exciton peak; not hydrogenic binding energy or gap lookup.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledWse2ExcitonTransitionEv",
      label: "Modeled wse2 exciton transition ev",
      kind: "number",
    },
    {
      id: "signedExcitonPeakDifferenceEv",
      label: "Signed exciton peak difference ev",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerWse2QuasiparticleGapEv:
        value.callerWse2QuasiparticleGapEv as number,
      callerMatchedWse2ExcitonBindingEv:
        value.callerMatchedWse2ExcitonBindingEv as number,
      observedWse2ExcitonPeakEv: value.observedWse2ExcitonPeakEv as number,
    }),
});
export const run = tool.execute;
export default tool;
