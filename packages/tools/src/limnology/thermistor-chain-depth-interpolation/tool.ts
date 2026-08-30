import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  ordered,
  interpolate,
} from "../shared.js";
export type Input = Readonly<{
  readonly sensorDepthsM: readonly number[];
  readonly temperatureProfilesC: readonly (readonly number[])[];
  readonly queryDepthsM: readonly number[];
}>;
export type Output = Readonly<{
  readonly interpolatedTemperatureProfilesC: readonly (readonly number[])[];
}>;
const inputFields = [
  { id: "sensorDepthsM", label: "Sensor depths m", kind: "numberList" },
  {
    id: "temperatureProfilesC",
    label: "Temperature profiles c",
    kind: "matrix",
  },
  { id: "queryDepthsM", label: "Query depths m", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.sensorDepthsM.forEach((v) => nonnegative(v, "sensorDepthsM"));
  input.queryDepthsM.forEach((v) => nonnegative(v, "queryDepthsM"));
  ordered(input.sensorDepthsM, "sensorDepthsM");
  if (
    !input.temperatureProfilesC.length ||
    !input.queryDepthsM.length ||
    input.queryDepthsM.length > 128 ||
    input.temperatureProfilesC.some(
      (row) => row.length !== input.sensorDepthsM.length,
    ) ||
    input.queryDepthsM.length *
      input.sensorDepthsM.length *
      input.temperatureProfilesC.length >
      1000000
  )
    simpleError(
      "temperatureProfilesC",
      "Aligned profiles, 1–128 queries and bounded interpolation work required.",
    );
  return {
    interpolatedTemperatureProfilesC: input.temperatureProfilesC.map((row) =>
      input.queryDepthsM.map((z) => interpolate(input.sensorDepthsM, row, z)),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  sensorDepthsM: [0, 5, 10],
  temperatureProfilesC: [
    [20, 10, 0],
    [10, 5, 0],
  ],
  queryDepthsM: [2.5, 7.5],
} satisfies Input;
export const exampleOutput = {
  interpolatedTemperatureProfilesC: [
    [15, 5],
    [7.5, 2.5],
  ],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/thermistor-chain-depth-interpolation",
  title: "Thermistor Chain Depth Interpolation Tool",
  description:
    "Interpolate each observed thermistor-chain profile to a shared depth grid only inside measured bounds; no time interpolation, sensor-gap reconstruction or profile extrapolation.",
  inputs: inputFields,
  outputs: [
    {
      id: "interpolatedTemperatureProfilesC",
      label: "Interpolated temperature profiles c",
      kind: "matrix",
    },
  ],
  calculate: (value) =>
    calculate({
      sensorDepthsM: value.sensorDepthsM as readonly number[],
      temperatureProfilesC:
        value.temperatureProfilesC as readonly (readonly number[])[],
      queryDepthsM: value.queryDepthsM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
