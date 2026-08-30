import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../shared.js";
import { calculateWindChillApparent } from "../../sailing/wind-chill-apparent/tool.js";
export type Input = Readonly<{
  readonly observedAirTemperaturesC: readonly number[];
  readonly observedWindSpeedsKmPerHour: readonly number[];
  readonly representedHours: readonly number[];
}>;
export type Output = Readonly<{
  readonly validWindChillMeanC: number;
  readonly validExposureFraction: number;
  readonly validObservationCount: number;
}>;
const inputFields = [
  {
    id: "observedAirTemperaturesC",
    label: "Observed air temperatures c",
    kind: "numberList",
  },
  {
    id: "observedWindSpeedsKmPerHour",
    label: "Observed wind speeds km per hour",
    kind: "numberList",
  },
  { id: "representedHours", label: "Represented hours", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.representedHours.forEach((v) => positive(v, "representedHours"));
  input.observedWindSpeedsKmPerHour.forEach((v) =>
    nonnegative(v, "observedWindSpeedsKmPerHour"),
  );
  aligned(
    input.observedAirTemperaturesC,
    input.observedWindSpeedsKmPerHour,
    "observedAirTemperaturesC",
  );
  aligned(
    input.observedAirTemperaturesC,
    input.representedHours,
    "observedAirTemperaturesC",
  );
  let weighted = 0,
    valid = 0,
    countValid = 0;
  input.observedAirTemperaturesC.forEach((t, i) => {
    if (t <= 10 && input.observedWindSpeedsKmPerHour[i] >= 4.8) {
      weighted +=
        calculateWindChillApparent({
          tempC: t,
          windSpeedKph: input.observedWindSpeedsKmPerHour[i],
        }).apparentTemperatureC * input.representedHours[i];
      valid += input.representedHours[i];
      countValid++;
    }
  });
  return {
    validWindChillMeanC: weighted / positive(valid, "validWindChillHours"),
    validExposureFraction:
      valid / input.representedHours.reduce((a, b) => a + b, 0),
    validObservationCount: countValid,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedAirTemperaturesC: [-5, -5, 20],
  observedWindSpeedsKmPerHour: [30, 30, 30],
  representedHours: [1, 2, 3],
} satisfies Input;
export const exampleOutput = {
  validWindChillMeanC: -12.996724811921073,
  validExposureFraction: 0.5,
  validObservationCount: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/wind-chill-monthly-mean",
  title: "Wind Chill Climatological Monthly Mean",
  description:
    "Summarize caller observed month exposure using existing wind-chill equation only where T≤10 C and wind≥4.8 km/h; invalid observations are excluded with coverage, not computed from monthly mean weather or certified cold safety.",
  inputs: inputFields,
  outputs: [
    {
      id: "validWindChillMeanC",
      label: "Valid wind chill mean c",
      kind: "number",
    },
    {
      id: "validExposureFraction",
      label: "Valid exposure fraction",
      kind: "number",
    },
    {
      id: "validObservationCount",
      label: "Valid observation count",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedAirTemperaturesC:
        value.observedAirTemperaturesC as readonly number[],
      observedWindSpeedsKmPerHour:
        value.observedWindSpeedsKmPerHour as readonly number[],
      representedHours: value.representedHours as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
