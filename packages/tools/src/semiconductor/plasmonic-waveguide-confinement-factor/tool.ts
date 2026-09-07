import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  binary,
  sum,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedRegionEnergyDensity: readonly number[];
  readonly observedCellVolumesM3: readonly number[];
  readonly callerPlasmonActiveRegionFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly energyWeightedPlasmonConfinementFraction: number;
}>;
const inputFields = [
  {
    id: "observedRegionEnergyDensity",
    label: "Observed region energy density",
    kind: "numberList",
  },
  {
    id: "observedCellVolumesM3",
    label: "Observed cell volumes m3",
    kind: "numberList",
  },
  {
    id: "callerPlasmonActiveRegionFlags",
    label: "Caller plasmon active region flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedCellVolumesM3.forEach((v) =>
    positive(v, "observedCellVolumesM3"),
  );
  input.observedRegionEnergyDensity.forEach((v) =>
    nonnegative(v, "observedRegionEnergyDensity"),
  );
  binary(
    input.callerPlasmonActiveRegionFlags,
    "callerPlasmonActiveRegionFlags",
  );
  aligned(
    input.observedRegionEnergyDensity,
    input.observedCellVolumesM3,
    "observedRegionEnergyDensity",
  );
  aligned(
    input.observedRegionEnergyDensity,
    input.callerPlasmonActiveRegionFlags,
    "observedRegionEnergyDensity",
  );
  const energy = input.observedRegionEnergyDensity.map(
      (v, i) => v * input.observedCellVolumesM3[i],
    ),
    total = sum(energy);
  positive(total, "totalModeEnergy");
  return {
    energyWeightedPlasmonConfinementFraction:
      sum(energy.filter((_, i) => input.callerPlasmonActiveRegionFlags[i])) /
      total,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedRegionEnergyDensity: [1, 2, 3],
  observedCellVolumesM3: [1, 1, 2],
  callerPlasmonActiveRegionFlags: [1, 0, 1],
} satisfies Input;
export const exampleOutput = {
  energyWeightedPlasmonConfinementFraction: 0.7777777777777778,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/plasmonic-waveguide-confinement-factor",
  title: "Semiconductor Plasmonic Waveguide Confinement Factor Calculator",
  description:
    "Integrate actual caller physically appropriate dispersive modal energy density over observed cell volumes/region flags, not simple geometric volume fraction or naive ε|E|² in metals.",
  inputs: inputFields,
  outputs: [
    {
      id: "energyWeightedPlasmonConfinementFraction",
      label: "Energy weighted plasmon confinement fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedRegionEnergyDensity:
        value.observedRegionEnergyDensity as readonly number[],
      observedCellVolumesM3: value.observedCellVolumesM3 as readonly number[],
      callerPlasmonActiveRegionFlags:
        value.callerPlasmonActiveRegionFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
