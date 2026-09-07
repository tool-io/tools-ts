import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  linearFit,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedValleyPlusEnergyEv: readonly number[];
  readonly observedValleyMinusEnergyEv: readonly number[];
  readonly observedMatchedFieldsTesla: readonly number[];
  readonly callerBohrMagnetonEvTesla: number;
}>;
export type Output = Readonly<{
  readonly signedValleySplittingsEv: readonly number[];
  readonly fittedValleyZeemanGFactor: number;
}>;
const inputFields = [
  {
    id: "observedValleyPlusEnergyEv",
    label: "Observed valley plus energy ev",
    kind: "numberList",
  },
  {
    id: "observedValleyMinusEnergyEv",
    label: "Observed valley minus energy ev",
    kind: "numberList",
  },
  {
    id: "observedMatchedFieldsTesla",
    label: "Observed matched fields tesla",
    kind: "numberList",
  },
  {
    id: "callerBohrMagnetonEvTesla",
    label: "Caller bohr magneton ev tesla",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerBohrMagnetonEvTesla, "callerBohrMagnetonEvTesla");
  aligned(
    input.observedValleyPlusEnergyEv,
    input.observedValleyMinusEnergyEv,
    "observedValleyPlusEnergyEv",
  );
  aligned(
    input.observedValleyPlusEnergyEv,
    input.observedMatchedFieldsTesla,
    "observedValleyPlusEnergyEv",
  );
  const delta = input.observedValleyPlusEnergyEv.map(
      (v, i) => v - input.observedValleyMinusEnergyEv[i],
    ),
    fit = linearFit(input.observedMatchedFieldsTesla, delta);
  return {
    signedValleySplittingsEv: delta,
    fittedValleyZeemanGFactor: fit.slope / input.callerBohrMagnetonEvTesla,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedValleyPlusEnergyEv: [1, 2, 3],
  observedValleyMinusEnergyEv: [1, 1, 1],
  observedMatchedFieldsTesla: [0, 1, 2],
  callerBohrMagnetonEvTesla: 0.5,
} satisfies Input;
export const exampleOutput = {
  signedValleySplittingsEv: [0, 1, 2],
  fittedValleyZeemanGFactor: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/valley-zeeman-splitting",
  title: "Semiconductor Valley Zeeman Splitting Calculator",
  description:
    "Extract actual assigned valley spectral splitting and linear g from field-dependent measurements, not generic spin Zeeman forward energy or fixed material g.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedValleySplittingsEv",
      label: "Signed valley splittings ev",
      kind: "numberList",
    },
    {
      id: "fittedValleyZeemanGFactor",
      label: "Fitted valley zeeman g factor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedValleyPlusEnergyEv:
        value.observedValleyPlusEnergyEv as readonly number[],
      observedValleyMinusEnergyEv:
        value.observedValleyMinusEnergyEv as readonly number[],
      observedMatchedFieldsTesla:
        value.observedMatchedFieldsTesla as readonly number[],
      callerBohrMagnetonEvTesla: value.callerBohrMagnetonEvTesla as number,
    }),
});
export const run = tool.execute;
export default tool;
