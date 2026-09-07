import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedAddedElectronPerM3: readonly number[];
  readonly observedAddedHolePerM3: readonly number[];
  readonly callerMatchedElectronIndexCoefficientM3: number;
  readonly callerMatchedHoleIndexCoefficientM3: number;
}>;
export type Output = Readonly<{
  readonly modeledSignedFreeCarrierIndexChanges: readonly number[];
}>;
const inputFields = [
  {
    id: "observedAddedElectronPerM3",
    label: "Observed added electron per m3",
    kind: "numberList",
  },
  {
    id: "observedAddedHolePerM3",
    label: "Observed added hole per m3",
    kind: "numberList",
  },
  {
    id: "callerMatchedElectronIndexCoefficientM3",
    label: "Caller matched electron index coefficient m3",
    kind: "number",
  },
  {
    id: "callerMatchedHoleIndexCoefficientM3",
    label: "Caller matched hole index coefficient m3",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedAddedElectronPerM3.forEach((v) =>
    nonnegative(v, "observedAddedElectronPerM3"),
  );
  input.observedAddedHolePerM3.forEach((v) =>
    nonnegative(v, "observedAddedHolePerM3"),
  );
  aligned(
    input.observedAddedElectronPerM3,
    input.observedAddedHolePerM3,
    "observedAddedElectronPerM3",
  );
  return {
    modeledSignedFreeCarrierIndexChanges: input.observedAddedElectronPerM3.map(
      (v, i) =>
        v * input.callerMatchedElectronIndexCoefficientM3 +
        input.observedAddedHolePerM3[i] *
          input.callerMatchedHoleIndexCoefficientM3,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedAddedElectronPerM3: [1, 2],
  observedAddedHolePerM3: [2, 1],
  callerMatchedElectronIndexCoefficientM3: -0.01,
  callerMatchedHoleIndexCoefficientM3: -0.02,
} satisfies Input;
export const exampleOutput = {
  modeledSignedFreeCarrierIndexChanges: [-0.05, -0.04],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/si-photonics-free-carrier-dispersion",
  title: "Semiconductor Si Photonics Free Carrier Dispersion Calculator",
  description:
    "Evaluate caller locally calibrated electron/hole free-carrier index derivatives on observed added densities, not fixed silicon empirical constants or optical phase shift formula.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledSignedFreeCarrierIndexChanges",
      label: "Modeled signed free carrier index changes",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedAddedElectronPerM3:
        value.observedAddedElectronPerM3 as readonly number[],
      observedAddedHolePerM3: value.observedAddedHolePerM3 as readonly number[],
      callerMatchedElectronIndexCoefficientM3:
        value.callerMatchedElectronIndexCoefficientM3 as number,
      callerMatchedHoleIndexCoefficientM3:
        value.callerMatchedHoleIndexCoefficientM3 as number,
    }),
});
export const run = tool.execute;
export default tool;
