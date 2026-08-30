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
  interpolate,
} from "../shared.js";
export type Input = Readonly<{
  readonly calibrationRefractiveIndexes: readonly number[];
  readonly calibrationWaterPercents: readonly number[];
  readonly measuredRefractiveIndex: number;
  readonly measuredTemperatureC: number;
  readonly referenceTemperatureC: number;
  readonly indexCorrectionPerDegreeC: number;
}>;
export type Output = Readonly<{
  readonly temperatureCorrectedIndex: number;
  readonly estimatedWaterPercent: number;
}>;
const inputFields = [
  {
    id: "calibrationRefractiveIndexes",
    label: "Calibration refractive indexes",
    kind: "numberList",
  },
  {
    id: "calibrationWaterPercents",
    label: "Calibration water percents",
    kind: "numberList",
  },
  {
    id: "measuredRefractiveIndex",
    label: "Measured refractive index",
    kind: "number",
  },
  {
    id: "measuredTemperatureC",
    label: "Measured temperature c",
    kind: "number",
  },
  {
    id: "referenceTemperatureC",
    label: "Reference temperature c",
    kind: "number",
  },
  {
    id: "indexCorrectionPerDegreeC",
    label: "Index correction per degree c",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.measuredRefractiveIndex, "measuredRefractiveIndex");
  input.calibrationWaterPercents.forEach((v) =>
    nonnegative(v, "calibrationWaterPercents"),
  );
  if (input.calibrationWaterPercents.some((v) => v > 100))
    simpleError(
      "calibrationWaterPercents",
      "Water percentages within [0,100] required.",
    );
  const temperatureCorrectedIndex =
    input.measuredRefractiveIndex +
    (input.measuredTemperatureC - input.referenceTemperatureC) *
      input.indexCorrectionPerDegreeC;
  return {
    temperatureCorrectedIndex,
    estimatedWaterPercent: interpolate(
      input.calibrationRefractiveIndexes,
      input.calibrationWaterPercents,
      temperatureCorrectedIndex,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  calibrationRefractiveIndexes: [1.4, 1.5, 1.6],
  calibrationWaterPercents: [30, 20, 10],
  measuredRefractiveIndex: 1.52,
  measuredTemperatureC: 25,
  referenceTemperatureC: 20,
  indexCorrectionPerDegreeC: 0.001,
} satisfies Input;
export const exampleOutput = {
  temperatureCorrectedIndex: 1.525,
  estimatedWaterPercent: 17.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/moisture-refractometer-honey-percent-water",
  title: "Moisture Refractometer Honey Percent Water Tool",
  description:
    "Interpolate supplied refractometer water calibration after a caller linear temperature correction; no mutable honey reference table or fermentation-safety threshold.",
  inputs: inputFields,
  outputs: [
    {
      id: "temperatureCorrectedIndex",
      label: "Temperature corrected index",
      kind: "number",
    },
    {
      id: "estimatedWaterPercent",
      label: "Estimated water percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      calibrationRefractiveIndexes:
        value.calibrationRefractiveIndexes as readonly number[],
      calibrationWaterPercents:
        value.calibrationWaterPercents as readonly number[],
      measuredRefractiveIndex: value.measuredRefractiveIndex as number,
      measuredTemperatureC: value.measuredTemperatureC as number,
      referenceTemperatureC: value.referenceTemperatureC as number,
      indexCorrectionPerDegreeC: value.indexCorrectionPerDegreeC as number,
    }),
});
export const run = tool.execute;
export default tool;
