import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  sum,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedHoneyCalibrationMassLb: readonly number[];
  readonly observedSameTemperatureVolumesCallerGallon: readonly number[];
}>;
export type Output = Readonly<{
  readonly pooledObservedHoneyLbPerCallerGallon: number;
}>;
const inputFields = [
  {
    id: "observedHoneyCalibrationMassLb",
    label: "Observed honey calibration mass lb",
    kind: "numberList",
  },
  {
    id: "observedSameTemperatureVolumesCallerGallon",
    label: "Observed same temperature volumes caller gallon",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedHoneyCalibrationMassLb.forEach((v) =>
    positive(v, "observedHoneyCalibrationMassLb"),
  );
  input.observedSameTemperatureVolumesCallerGallon.forEach((v) =>
    positive(v, "observedSameTemperatureVolumesCallerGallon"),
  );
  aligned(
    input.observedHoneyCalibrationMassLb,
    input.observedSameTemperatureVolumesCallerGallon,
    "observedHoneyCalibrationMassLb",
  );
  return {
    pooledObservedHoneyLbPerCallerGallon:
      sum(input.observedHoneyCalibrationMassLb) /
      sum(input.observedSameTemperatureVolumesCallerGallon),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedHoneyCalibrationMassLb: [2, 4],
  observedSameTemperatureVolumesCallerGallon: [0.2, 0.4],
} satisfies Input;
export const exampleOutput = {
  pooledObservedHoneyLbPerCallerGallon: 10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/honey-density-pound-per-gallon",
  title: "Honey Density Pound Per Gallon Lookup",
  description:
    "Observed pooled same-temperature honey density in caller explicitly established gallon convention; sample totals weighted by volume, not a fixed density or conversion alias. Caller independently verifies strain, site, protocol and evidence; not colony-health, treatment, transport-safety or regulatory certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "pooledObservedHoneyLbPerCallerGallon",
      label: "Pooled observed honey lb per caller gallon",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedHoneyCalibrationMassLb:
        value.observedHoneyCalibrationMassLb as readonly number[],
      observedSameTemperatureVolumesCallerGallon:
        value.observedSameTemperatureVolumesCallerGallon as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
