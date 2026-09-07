import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedPhotodiodeActiveAreasM2: readonly number[];
  readonly callerMatchedPermittivitiesFM: readonly number[];
  readonly observedDepletionDepthsM: readonly number[];
  readonly observedParallelStrayFarads: readonly number[];
}>;
export type Output = Readonly<{
  readonly modeledPhotodiodeTotalCapacitancesFarads: readonly number[];
}>;
const inputFields = [
  {
    id: "observedPhotodiodeActiveAreasM2",
    label: "Observed photodiode active areas m2",
    kind: "numberList",
  },
  {
    id: "callerMatchedPermittivitiesFM",
    label: "Caller matched permittivities f m",
    kind: "numberList",
  },
  {
    id: "observedDepletionDepthsM",
    label: "Observed depletion depths m",
    kind: "numberList",
  },
  {
    id: "observedParallelStrayFarads",
    label: "Observed parallel stray farads",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerMatchedPermittivitiesFM.forEach((v) =>
    positive(v, "callerMatchedPermittivitiesFM"),
  );
  input.observedDepletionDepthsM.forEach((v) =>
    positive(v, "observedDepletionDepthsM"),
  );
  input.observedPhotodiodeActiveAreasM2.forEach((v) =>
    nonnegative(v, "observedPhotodiodeActiveAreasM2"),
  );
  input.observedParallelStrayFarads.forEach((v) =>
    nonnegative(v, "observedParallelStrayFarads"),
  );
  aligned(
    input.observedPhotodiodeActiveAreasM2,
    input.callerMatchedPermittivitiesFM,
    "observedPhotodiodeActiveAreasM2",
  );
  aligned(
    input.observedPhotodiodeActiveAreasM2,
    input.observedDepletionDepthsM,
    "observedPhotodiodeActiveAreasM2",
  );
  aligned(
    input.observedPhotodiodeActiveAreasM2,
    input.observedParallelStrayFarads,
    "observedPhotodiodeActiveAreasM2",
  );
  return {
    modeledPhotodiodeTotalCapacitancesFarads:
      input.observedPhotodiodeActiveAreasM2.map(
        (v, i) =>
          (v * input.callerMatchedPermittivitiesFM[i]) /
            input.observedDepletionDepthsM[i] +
          input.observedParallelStrayFarads[i],
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPhotodiodeActiveAreasM2: [1e-6, 2e-6],
  callerMatchedPermittivitiesFM: [1e-10, 1e-10],
  observedDepletionDepthsM: [1e-6, 2e-6],
  observedParallelStrayFarads: [1e-11, 2e-11],
} satisfies Input;
export const exampleOutput = {
  modeledPhotodiodeTotalCapacitancesFarads: [1.1e-10, 1.2e-10],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/photodiode-capacitance",
  title: "Semiconductor Photodiode Capacitance Calculator",
  description:
    "Budget measured depletion geometry and independently measured parallel stray capacitances per photodiode, not an abrupt-silicon doping default or one plate capacitor.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledPhotodiodeTotalCapacitancesFarads",
      label: "Modeled photodiode total capacitances farads",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedPhotodiodeActiveAreasM2:
        value.observedPhotodiodeActiveAreasM2 as readonly number[],
      callerMatchedPermittivitiesFM:
        value.callerMatchedPermittivitiesFM as readonly number[],
      observedDepletionDepthsM:
        value.observedDepletionDepthsM as readonly number[],
      observedParallelStrayFarads:
        value.observedParallelStrayFarads as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
