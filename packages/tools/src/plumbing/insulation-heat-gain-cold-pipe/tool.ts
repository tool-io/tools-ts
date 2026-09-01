import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedColdPipeC: number;
  readonly observedAmbientC: number;
  readonly callerMatchedTotalThermalResistancesKelvinMPerWatt: readonly number[];
  readonly observedPipeLengthsM: readonly number[];
}>;
export type Output = Readonly<{
  readonly modeledInsulatedHeatGainWattsByRun: readonly number[];
  readonly combinedModeledColdPipeHeatGainWatts: number;
}>;
const inputFields = [
  { id: "observedColdPipeC", label: "Observed cold pipe c", kind: "number" },
  { id: "observedAmbientC", label: "Observed ambient c", kind: "number" },
  {
    id: "callerMatchedTotalThermalResistancesKelvinMPerWatt",
    label: "Caller matched total thermal resistances kelvin m per watt",
    kind: "numberList",
  },
  {
    id: "observedPipeLengthsM",
    label: "Observed pipe lengths m",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerMatchedTotalThermalResistancesKelvinMPerWatt.forEach((v) =>
    positive(v, "callerMatchedTotalThermalResistancesKelvinMPerWatt"),
  );
  input.observedPipeLengthsM.forEach((v) =>
    nonnegative(v, "observedPipeLengthsM"),
  );
  aligned(
    input.callerMatchedTotalThermalResistancesKelvinMPerWatt,
    input.observedPipeLengthsM,
    "callerMatchedTotalThermalResistancesKelvinMPerWatt",
  );
  const gains = input.callerMatchedTotalThermalResistancesKelvinMPerWatt.map(
    (v, i) =>
      ((input.observedAmbientC - input.observedColdPipeC) / v) *
      input.observedPipeLengthsM[i],
  );
  return {
    modeledInsulatedHeatGainWattsByRun: gains,
    combinedModeledColdPipeHeatGainWatts: sum(gains),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedColdPipeC: 5,
  observedAmbientC: 25,
  callerMatchedTotalThermalResistancesKelvinMPerWatt: [2, 4],
  observedPipeLengthsM: [10, 20],
} satisfies Input;
export const exampleOutput = {
  modeledInsulatedHeatGainWattsByRun: [100, 100],
  combinedModeledColdPipeHeatGainWatts: 200,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/insulation-heat-gain-cold-pipe",
  title: "Plumbing Insulation Heat Gain Cold Pipe Calculator",
  description:
    "Budget actual cold-pipe run lengths and independently calibrated total radial resistance per unit length; signed ambient gain, not bare-pipe convection or automatic insulation design.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledInsulatedHeatGainWattsByRun",
      label: "Modeled insulated heat gain watts by run",
      kind: "numberList",
    },
    {
      id: "combinedModeledColdPipeHeatGainWatts",
      label: "Combined modeled cold pipe heat gain watts",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedColdPipeC: value.observedColdPipeC as number,
      observedAmbientC: value.observedAmbientC as number,
      callerMatchedTotalThermalResistancesKelvinMPerWatt:
        value.callerMatchedTotalThermalResistancesKelvinMPerWatt as readonly number[],
      observedPipeLengthsM: value.observedPipeLengthsM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
