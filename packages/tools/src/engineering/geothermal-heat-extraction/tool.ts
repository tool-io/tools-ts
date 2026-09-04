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
  readonly observedGeothermalFluidMassKgSecond: number;
  readonly callerSpecificHeatJKgK: number;
  readonly observedProductionTemperatureC: number;
  readonly observedReturnTemperatureC: number;
  readonly callerIndependentExtractionRetentionFraction: number;
}>;
export type Output = Readonly<{ readonly modeledNetGeothermalHeatW: number }>;
const inputFields = [
  {
    id: "observedGeothermalFluidMassKgSecond",
    label: "Observed geothermal fluid mass kg second",
    kind: "number",
  },
  {
    id: "callerSpecificHeatJKgK",
    label: "Caller specific heat j kg k",
    kind: "number",
  },
  {
    id: "observedProductionTemperatureC",
    label: "Observed production temperature c",
    kind: "number",
  },
  {
    id: "observedReturnTemperatureC",
    label: "Observed return temperature c",
    kind: "number",
  },
  {
    id: "callerIndependentExtractionRetentionFraction",
    label: "Caller independent extraction retention fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerSpecificHeatJKgK, "callerSpecificHeatJKgK");
  nonnegative(
    input.observedGeothermalFluidMassKgSecond,
    "observedGeothermalFluidMassKgSecond",
  );
  fraction(
    input.callerIndependentExtractionRetentionFraction,
    "callerIndependentExtractionRetentionFraction",
  );
  return {
    modeledNetGeothermalHeatW:
      input.observedGeothermalFluidMassKgSecond *
      input.callerSpecificHeatJKgK *
      (input.observedProductionTemperatureC -
        input.observedReturnTemperatureC) *
      input.callerIndependentExtractionRetentionFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedGeothermalFluidMassKgSecond: 2,
  callerSpecificHeatJKgK: 3,
  observedProductionTemperatureC: 100,
  observedReturnTemperatureC: 70,
  callerIndependentExtractionRetentionFraction: 0.5,
} satisfies Input;
export const exampleOutput = { modeledNetGeothermalHeatW: 90 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/geothermal-heat-extraction",
  title: "Geothermal Heat Extraction Calculator",
  description:
    "Net observed geothermal extraction with actual return temperature and independent retained fraction, not gross generic sensible heat. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledNetGeothermalHeatW",
      label: "Modeled net geothermal heat w",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedGeothermalFluidMassKgSecond:
        value.observedGeothermalFluidMassKgSecond as number,
      callerSpecificHeatJKgK: value.callerSpecificHeatJKgK as number,
      observedProductionTemperatureC:
        value.observedProductionTemperatureC as number,
      observedReturnTemperatureC: value.observedReturnTemperatureC as number,
      callerIndependentExtractionRetentionFraction:
        value.callerIndependentExtractionRetentionFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
