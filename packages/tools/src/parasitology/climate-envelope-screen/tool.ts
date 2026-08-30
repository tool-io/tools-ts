import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly temperatureC: number;
  readonly precipitationMm: number;
  readonly minimumTemperatureC: number;
  readonly maximumTemperatureC: number;
  readonly minimumPrecipitationMm: number;
  readonly maximumPrecipitationMm: number;
}>;
export type Output = Readonly<{
  readonly temperatureWithinEnvelope: boolean;
  readonly precipitationWithinEnvelope: boolean;
  readonly withinEnvelope: boolean;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.minimumTemperatureC > input.maximumTemperatureC ||
    input.minimumPrecipitationMm < 0 ||
    input.maximumPrecipitationMm < input.minimumPrecipitationMm ||
    input.precipitationMm < 0
  )
    simpleError(
      "minimumTemperatureC",
      "Ordered temperature and nonnegative precipitation bounds required.",
    );
  const temperatureWithinEnvelope =
      input.temperatureC >= input.minimumTemperatureC &&
      input.temperatureC <= input.maximumTemperatureC,
    precipitationWithinEnvelope =
      input.precipitationMm >= input.minimumPrecipitationMm &&
      input.precipitationMm <= input.maximumPrecipitationMm;
  return {
    temperatureWithinEnvelope,
    precipitationWithinEnvelope,
    withinEnvelope: temperatureWithinEnvelope && precipitationWithinEnvelope,
  };
};
export const exampleInput = {
  temperatureC: 25,
  precipitationMm: 100,
  minimumTemperatureC: 20,
  maximumTemperatureC: 30,
  minimumPrecipitationMm: 50,
  maximumPrecipitationMm: 150,
} satisfies Input;
export const exampleOutput = {
  temperatureWithinEnvelope: true,
  precipitationWithinEnvelope: true,
  withinEnvelope: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parasitology/climate-envelope-screen",
  title: "Climate Envelope Screen",
  description:
    "Screen climate observations against a caller-defined suitability envelope, not a transmission prediction.",
  inputs: [
    { id: "temperatureC", label: "Temperature c", kind: "number" },
    { id: "precipitationMm", label: "Precipitation mm", kind: "number" },
    {
      id: "minimumTemperatureC",
      label: "Minimum temperature c",
      kind: "number",
    },
    {
      id: "maximumTemperatureC",
      label: "Maximum temperature c",
      kind: "number",
    },
    {
      id: "minimumPrecipitationMm",
      label: "Minimum precipitation mm",
      kind: "number",
    },
    {
      id: "maximumPrecipitationMm",
      label: "Maximum precipitation mm",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "temperatureWithinEnvelope",
      label: "Temperature within envelope",
      kind: "boolean",
    },
    {
      id: "precipitationWithinEnvelope",
      label: "Precipitation within envelope",
      kind: "boolean",
    },
    { id: "withinEnvelope", label: "Within envelope", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      temperatureC: value.temperatureC as number,
      precipitationMm: value.precipitationMm as number,
      minimumTemperatureC: value.minimumTemperatureC as number,
      maximumTemperatureC: value.maximumTemperatureC as number,
      minimumPrecipitationMm: value.minimumPrecipitationMm as number,
      maximumPrecipitationMm: value.maximumPrecipitationMm as number,
    }),
});
export const run = tool.execute;
export default tool;
