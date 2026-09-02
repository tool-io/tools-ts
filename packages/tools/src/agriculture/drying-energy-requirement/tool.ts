import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedRemovedWaterKg: number;
  readonly callerLatentHeatJKg: number;
  readonly callerSensibleGrainHeatJ: number;
  readonly callerDryerUsefulHeatFraction: number;
}>;
export type Output = Readonly<{ readonly boundaryDryingEnergyJ: number }>;
const inputFields = [
  {
    id: "observedRemovedWaterKg",
    label: "Observed removed water kg",
    kind: "number",
  },
  {
    id: "callerLatentHeatJKg",
    label: "Caller latent heat j kg",
    kind: "number",
  },
  {
    id: "callerSensibleGrainHeatJ",
    label: "Caller sensible grain heat j",
    kind: "number",
  },
  {
    id: "callerDryerUsefulHeatFraction",
    label: "Caller dryer useful heat fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerLatentHeatJKg, "callerLatentHeatJKg");
  positive(
    input.callerDryerUsefulHeatFraction,
    "callerDryerUsefulHeatFraction",
  );
  nonnegative(input.observedRemovedWaterKg, "observedRemovedWaterKg");
  nonnegative(input.callerSensibleGrainHeatJ, "callerSensibleGrainHeatJ");
  fraction(
    input.callerDryerUsefulHeatFraction,
    "callerDryerUsefulHeatFraction",
  );
  return {
    boundaryDryingEnergyJ:
      (input.observedRemovedWaterKg * input.callerLatentHeatJKg +
        input.callerSensibleGrainHeatJ) /
      input.callerDryerUsefulHeatFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedRemovedWaterKg: 2,
  callerLatentHeatJKg: 100,
  callerSensibleGrainHeatJ: 50,
  callerDryerUsefulHeatFraction: 0.5,
} satisfies Input;
export const exampleOutput = { boundaryDryingEnergyJ: 500 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/drying-energy-requirement",
  title: "Agriculture Drying Energy Requirement Calculator",
  description:
    "Independent removed-water latent plus grain sensible heat and boundary efficiency, not water mass only or a heater recommendation. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "boundaryDryingEnergyJ",
      label: "Boundary drying energy j",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedRemovedWaterKg: value.observedRemovedWaterKg as number,
      callerLatentHeatJKg: value.callerLatentHeatJKg as number,
      callerSensibleGrainHeatJ: value.callerSensibleGrainHeatJ as number,
      callerDryerUsefulHeatFraction:
        value.callerDryerUsefulHeatFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
