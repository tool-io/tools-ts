import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  extrema,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedDotAbsorptionEnergyEv: readonly number[];
  readonly observedDotAbsorptionStrength: readonly number[];
  readonly callerExcitationWavelengthEvNm: number;
}>;
export type Output = Readonly<{
  readonly observedAbsorptionPeakEnergiesEv: readonly number[];
  readonly observedAbsorptionPeakWavelengthNm: readonly number[];
}>;
const inputFields = [
  {
    id: "observedDotAbsorptionEnergyEv",
    label: "Observed dot absorption energy ev",
    kind: "numberList",
  },
  {
    id: "observedDotAbsorptionStrength",
    label: "Observed dot absorption strength",
    kind: "numberList",
  },
  {
    id: "callerExcitationWavelengthEvNm",
    label: "Caller excitation wavelength ev nm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedDotAbsorptionEnergyEv.forEach((v) =>
    positive(v, "observedDotAbsorptionEnergyEv"),
  );
  positive(
    input.callerExcitationWavelengthEvNm,
    "callerExcitationWavelengthEvNm",
  );
  input.observedDotAbsorptionStrength.forEach((v) =>
    nonnegative(v, "observedDotAbsorptionStrength"),
  );
  const peak = extrema(
    input.observedDotAbsorptionEnergyEv,
    input.observedDotAbsorptionStrength,
    true,
  );
  return {
    observedAbsorptionPeakEnergiesEv: peak.coordinates,
    observedAbsorptionPeakWavelengthNm: peak.coordinates.map(
      (v) => input.callerExcitationWavelengthEvNm / v,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDotAbsorptionEnergyEv: [1, 2, 3],
  observedDotAbsorptionStrength: [1, 4, 2],
  callerExcitationWavelengthEvNm: 1240,
} satisfies Input;
export const exampleOutput = {
  observedAbsorptionPeakEnergiesEv: [2],
  observedAbsorptionPeakWavelengthNm: [620],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/quantum-dot-absorption-peak",
  title: "Semiconductor Quantum Dot Absorption Peak Calculator",
  description:
    "Extract actual quantum-dot absorption spectral peak/ties and energy→wavelength conversion, distinct from existing CdSe empirical size inversion or photoluminescence peak.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedAbsorptionPeakEnergiesEv",
      label: "Observed absorption peak energies ev",
      kind: "numberList",
    },
    {
      id: "observedAbsorptionPeakWavelengthNm",
      label: "Observed absorption peak wavelength nm",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDotAbsorptionEnergyEv:
        value.observedDotAbsorptionEnergyEv as readonly number[],
      observedDotAbsorptionStrength:
        value.observedDotAbsorptionStrength as readonly number[],
      callerExcitationWavelengthEvNm:
        value.callerExcitationWavelengthEvNm as number,
    }),
});
export const run = tool.execute;
export default tool;
