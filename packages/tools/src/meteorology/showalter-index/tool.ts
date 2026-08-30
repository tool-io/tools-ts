import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../shared.js";

export type Input = Readonly<{
  readonly temperature850ParcelC: number;
  readonly environment500HpaTemperatureC: number;
  readonly observed850HeightM: number;
  readonly observed500HeightM: number;
  readonly supplied850ParcelLclHeightM: number;
  readonly callerDryLapseCPerKm: number;
  readonly callerMoistLapseCPerKm: number;
}>;
export type Output = Readonly<{
  readonly piecewiseLifted850Parcel500TemperatureC: number;
  readonly calibratedShowalterIndexC: number;
}>;
const inputFields = [
  {
    id: "temperature850ParcelC",
    label: "Temperature850 parcel c",
    kind: "number",
  },
  {
    id: "environment500HpaTemperatureC",
    label: "Environment500 hpa temperature c",
    kind: "number",
  },
  { id: "observed850HeightM", label: "Observed850 height m", kind: "number" },
  { id: "observed500HeightM", label: "Observed500 height m", kind: "number" },
  {
    id: "supplied850ParcelLclHeightM",
    label: "Supplied850 parcel lcl height m",
    kind: "number",
  },
  {
    id: "callerDryLapseCPerKm",
    label: "Caller dry lapse c per km",
    kind: "number",
  },
  {
    id: "callerMoistLapseCPerKm",
    label: "Caller moist lapse c per km",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.callerDryLapseCPerKm, "callerDryLapseCPerKm");
  nonnegative(input.callerMoistLapseCPerKm, "callerMoistLapseCPerKm");
  if (
    input.observed500HeightM <= input.observed850HeightM ||
    input.supplied850ParcelLclHeightM < input.observed850HeightM
  )
    simpleError(
      "heights",
      "Ordered sounding heights and parcel LCL no lower than origin required.",
    );
  const dry =
      Math.min(input.supplied850ParcelLclHeightM, input.observed500HeightM) -
      input.observed850HeightM,
    moist = Math.max(
      0,
      input.observed500HeightM - input.supplied850ParcelLclHeightM,
    ),
    piecewiseLifted850Parcel500TemperatureC =
      input.temperature850ParcelC -
      (dry * input.callerDryLapseCPerKm +
        moist * input.callerMoistLapseCPerKm) /
        1000;
  return {
    piecewiseLifted850Parcel500TemperatureC,
    calibratedShowalterIndexC:
      input.environment500HpaTemperatureC -
      piecewiseLifted850Parcel500TemperatureC,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  temperature850ParcelC: 20,
  environment500HpaTemperatureC: -10,
  observed850HeightM: 1000,
  observed500HeightM: 5000,
  supplied850ParcelLclHeightM: 2000,
  callerDryLapseCPerKm: 10,
  callerMoistLapseCPerKm: 5,
} satisfies Input;
export const exampleOutput = {
  piecewiseLifted850Parcel500TemperatureC: -5,
  calibratedShowalterIndexC: -5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/showalter-index",
  title: "Showalter Index",
  description:
    "Estimate Showalter 850-hPa-origin parcel index via explicit supplied LCL and caller piecewise dry/moist lapse approximation; differs from supplied surface-parcel lifted index, not a full pseudoadiabatic solver or validated thunder forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "piecewiseLifted850Parcel500TemperatureC",
      label: "Piecewise lifted850 parcel500 temperature c",
      kind: "number",
    },
    {
      id: "calibratedShowalterIndexC",
      label: "Calibrated showalter index c",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      temperature850ParcelC: value.temperature850ParcelC as number,
      environment500HpaTemperatureC:
        value.environment500HpaTemperatureC as number,
      observed850HeightM: value.observed850HeightM as number,
      observed500HeightM: value.observed500HeightM as number,
      supplied850ParcelLclHeightM: value.supplied850ParcelLclHeightM as number,
      callerDryLapseCPerKm: value.callerDryLapseCPerKm as number,
      callerMoistLapseCPerKm: value.callerMoistLapseCPerKm as number,
    }),
});
export const run = tool.execute;
export default tool;
