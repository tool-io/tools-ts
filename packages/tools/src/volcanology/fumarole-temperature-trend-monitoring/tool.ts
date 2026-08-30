import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  ordered,
  regression,
} from "../shared.js";
export type Input = Readonly<{
  readonly timesDays: readonly number[];
  readonly measuredFumaroleTemperaturesC: readonly number[];
  readonly thermometerCalibrationOffsetsC: readonly number[];
  readonly comparisonTemperatureC: number;
}>;
export type Output = Readonly<{
  readonly calibrationCorrectedTemperaturesC: readonly number[];
  readonly fittedTemperatureChangeCPerDay: number;
  readonly modelComparisonDay: number;
  readonly fitRSquared: number;
}>;
const inputFields = [
  { id: "timesDays", label: "Times days", kind: "numberList" },
  {
    id: "measuredFumaroleTemperaturesC",
    label: "Measured fumarole temperatures c",
    kind: "numberList",
  },
  {
    id: "thermometerCalibrationOffsetsC",
    label: "Thermometer calibration offsets c",
    kind: "numberList",
  },
  {
    id: "comparisonTemperatureC",
    label: "Comparison temperature c",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(input.timesDays, input.thermometerCalibrationOffsetsC, "timesDays");
  aligned(input.timesDays, input.measuredFumaroleTemperaturesC, "timesDays");
  ordered(input.timesDays, "timesDays");
  const calibrationCorrectedTemperaturesC =
      input.measuredFumaroleTemperaturesC.map(
        (v, i) => v - input.thermometerCalibrationOffsetsC[i],
      ),
    fit = regression(input.timesDays, calibrationCorrectedTemperaturesC);
  if (fit.slope === 0)
    simpleError(
      "measuredFumaroleTemperaturesC",
      "No identifiable finite comparison timing for a flat fitted temperature.",
    );
  return {
    calibrationCorrectedTemperaturesC,
    fittedTemperatureChangeCPerDay: fit.slope,
    modelComparisonDay:
      (input.comparisonTemperatureC - fit.intercept) / fit.slope,
    fitRSquared: fit.rSquared,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  timesDays: [0, 1, 2],
  measuredFumaroleTemperaturesC: [100, 103, 108],
  thermometerCalibrationOffsetsC: [0, 1, 4],
  comparisonTemperatureC: 110,
} satisfies Input;
export const exampleOutput = {
  calibrationCorrectedTemperaturesC: [100, 102, 104],
  fittedTemperatureChangeCPerDay: 2,
  modelComparisonDay: 5,
  fitRSquared: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/fumarole-temperature-trend-monitoring",
  title: "Fumarole Temperature Trend Monitoring Tool",
  description:
    "Monitor thermometer-calibration-corrected fumarole temperature trend with explicitly linear comparison-time extrapolation; signed slopes/past crossing are retained, and gas-source/eruption attribution is not made.",
  inputs: inputFields,
  outputs: [
    {
      id: "calibrationCorrectedTemperaturesC",
      label: "Calibration corrected temperatures c",
      kind: "numberList",
    },
    {
      id: "fittedTemperatureChangeCPerDay",
      label: "Fitted temperature change c per day",
      kind: "number",
    },
    { id: "modelComparisonDay", label: "Model comparison day", kind: "number" },
    { id: "fitRSquared", label: "Fit r squared", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      timesDays: value.timesDays as readonly number[],
      measuredFumaroleTemperaturesC:
        value.measuredFumaroleTemperaturesC as readonly number[],
      thermometerCalibrationOffsetsC:
        value.thermometerCalibrationOffsetsC as readonly number[],
      comparisonTemperatureC: value.comparisonTemperatureC as number,
    }),
});
export const run = tool.execute;
export default tool;
