import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedDailyMeanTemperatureC: number;
  readonly observedDailySolarMJPerM2: number;
  readonly observedMeanRelativeHumidityPercent: number;
  readonly independentlyEffectiveRainMm: number;
}>;
export type Output = Readonly<{
  readonly turcReferenceEtMm: number;
  readonly conditionalRainOnlyIrrigationGapMm: number;
}>;
const inputFields = [
  {
    id: "observedDailyMeanTemperatureC",
    label: "Observed daily mean temperature c",
    kind: "number",
  },
  {
    id: "observedDailySolarMJPerM2",
    label: "Observed daily solar m j per m2",
    kind: "number",
  },
  {
    id: "observedMeanRelativeHumidityPercent",
    label: "Observed mean relative humidity percent",
    kind: "number",
  },
  {
    id: "independentlyEffectiveRainMm",
    label: "Independently effective rain mm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.observedDailyMeanTemperatureC,
    "observedDailyMeanTemperatureC",
  );
  nonnegative(input.observedDailySolarMJPerM2, "observedDailySolarMJPerM2");
  nonnegative(
    input.independentlyEffectiveRainMm,
    "independentlyEffectiveRainMm",
  );
  if (
    input.observedMeanRelativeHumidityPercent < 0 ||
    input.observedMeanRelativeHumidityPercent > 100
  )
    simpleError("RH", "0..100%.");
  return {
    turcReferenceEtMm:
      ((0.013 * input.observedDailyMeanTemperatureC) /
        (input.observedDailyMeanTemperatureC + 15)) *
      (23.8856 * input.observedDailySolarMJPerM2 + 50) *
      (input.observedMeanRelativeHumidityPercent < 50
        ? 1 + (50 - input.observedMeanRelativeHumidityPercent) / 70
        : 1),
    conditionalRainOnlyIrrigationGapMm: Math.max(
      0,
      ((0.013 * input.observedDailyMeanTemperatureC) /
        (input.observedDailyMeanTemperatureC + 15)) *
        (23.8856 * input.observedDailySolarMJPerM2 + 50) *
        (input.observedMeanRelativeHumidityPercent < 50
          ? 1 + (50 - input.observedMeanRelativeHumidityPercent) / 70
          : 1) -
        input.independentlyEffectiveRainMm,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDailyMeanTemperatureC: 20,
  observedDailySolarMJPerM2: 10,
  observedMeanRelativeHumidityPercent: 50,
  independentlyEffectiveRainMm: 1,
} satisfies Input;
export const exampleOutput = {
  turcReferenceEtMm: 2.1457874285714285,
  conditionalRainOnlyIrrigationGapMm: 1.1457874285714285,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/turc-irrigation-need",
  title: "Turc Irrigation Need Calculator",
  description:
    "Daily Turc reference ET with MJ→cal/cm²solar conversion and low RH correction; rain-only reference gap not crop irrigation prescription/soil budget. Caller independently establishes homogeneous observation coverage and model/reference applicability; not observed future climate, crop suitability or validated drought severity.",
  inputs: inputFields,
  outputs: [
    { id: "turcReferenceEtMm", label: "Turc reference et mm", kind: "number" },
    {
      id: "conditionalRainOnlyIrrigationGapMm",
      label: "Conditional rain only irrigation gap mm",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDailyMeanTemperatureC:
        value.observedDailyMeanTemperatureC as number,
      observedDailySolarMJPerM2: value.observedDailySolarMJPerM2 as number,
      observedMeanRelativeHumidityPercent:
        value.observedMeanRelativeHumidityPercent as number,
      independentlyEffectiveRainMm:
        value.independentlyEffectiveRainMm as number,
    }),
});
export const run = tool.execute;
export default tool;
