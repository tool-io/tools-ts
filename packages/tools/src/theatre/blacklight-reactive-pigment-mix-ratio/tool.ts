import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  weights,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly callerApprovedPigmentMassG: number;
  readonly callerApprovedBinderMassG: number;
  readonly targetMixtureMassG: number;
  readonly availablePigmentMassG: number;
}>;
export type Output = Readonly<{
  readonly scaledPigmentMassG: number;
  readonly scaledBinderMassG: number;
  readonly signedPigmentInventoryMarginG: number;
}>;
const inputFields = [
  {
    id: "callerApprovedPigmentMassG",
    label: "Caller approved pigment mass g",
    kind: "number",
  },
  {
    id: "callerApprovedBinderMassG",
    label: "Caller approved binder mass g",
    kind: "number",
  },
  { id: "targetMixtureMassG", label: "Target mixture mass g", kind: "number" },
  {
    id: "availablePigmentMassG",
    label: "Available pigment mass g",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.callerApprovedPigmentMassG, "callerApprovedPigmentMassG");
  nonnegative(input.callerApprovedBinderMassG, "callerApprovedBinderMassG");
  nonnegative(input.targetMixtureMassG, "targetMixtureMassG");
  nonnegative(input.availablePigmentMassG, "availablePigmentMassG");
  const w = weights([
      input.callerApprovedPigmentMassG,
      input.callerApprovedBinderMassG,
    ]),
    pigment = input.targetMixtureMassG * w[0];
  return {
    scaledPigmentMassG: pigment,
    scaledBinderMassG: input.targetMixtureMassG - pigment,
    signedPigmentInventoryMarginG: input.availablePigmentMassG - pigment,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerApprovedPigmentMassG: 10,
  callerApprovedBinderMassG: 90,
  targetMixtureMassG: 250,
  availablePigmentMassG: 20,
} satisfies Input;
export const exampleOutput = {
  scaledPigmentMassG: 25,
  scaledBinderMassG: 225,
  signedPigmentInventoryMarginG: -5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/blacklight-reactive-pigment-mix-ratio",
  title: "Blacklight Reactive Pigment Mix Ratio Calculator",
  description:
    "Reconcile actual approved pigment/binder batch scaling and pigment inventory; no universal blacklight recipe, fluorescence intensity, toxicology, curing/application or material compatibility advice.",
  inputs: inputFields,
  outputs: [
    {
      id: "scaledPigmentMassG",
      label: "Scaled pigment mass g",
      kind: "number",
    },
    { id: "scaledBinderMassG", label: "Scaled binder mass g", kind: "number" },
    {
      id: "signedPigmentInventoryMarginG",
      label: "Signed pigment inventory margin g",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerApprovedPigmentMassG: value.callerApprovedPigmentMassG as number,
      callerApprovedBinderMassG: value.callerApprovedBinderMassG as number,
      targetMixtureMassG: value.targetMixtureMassG as number,
      availablePigmentMassG: value.availablePigmentMassG as number,
    }),
});
export const run = tool.execute;
export default tool;
