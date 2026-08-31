import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish } from "../batch32-shared.js";
export type Input = Readonly<{
  readonly deltaO18Permil: number;
  readonly referenceDeltaO18Permil: number;
  readonly referenceTemperatureC: number;
  readonly callerCalibrationPermilPerC: number;
}>;
export type Output = Readonly<{
  readonly calibratedPaleotemperatureC: number;
  readonly isotopeTemperatureAnomalyC: number;
}>;
const inputFields = [
  { id: "deltaO18Permil", label: "Delta o18 permil", kind: "number" },
  {
    id: "referenceDeltaO18Permil",
    label: "Reference delta o18 permil",
    kind: "number",
  },
  {
    id: "referenceTemperatureC",
    label: "Reference temperature c",
    kind: "number",
  },
  {
    id: "callerCalibrationPermilPerC",
    label: "Caller calibration permil per c",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.callerCalibrationPermilPerC === 0)
    simpleError(
      "calibration",
      "Nonzero site-specific isotope/temperature slope required.",
    );
  const anomaly =
    (input.deltaO18Permil - input.referenceDeltaO18Permil) /
    input.callerCalibrationPermilPerC;
  return {
    calibratedPaleotemperatureC: input.referenceTemperatureC + anomaly,
    isotopeTemperatureAnomalyC: anomaly,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  deltaO18Permil: -30,
  referenceDeltaO18Permil: -35,
  referenceTemperatureC: -20,
  callerCalibrationPermilPerC: 0.5,
} satisfies Input;
export const exampleOutput = {
  calibratedPaleotemperatureC: -10,
  isotopeTemperatureAnomalyC: 10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/delta-o18-paleotemperature",
  title: "Delta O18 Paleotemperature Calculator",
  description:
    "Apply explicit caller local delta-18O reference/slope paleotemperature calibration; no universal isotope thermometer, age inference or correction for source/season/elevation changes.",
  inputs: inputFields,
  outputs: [
    {
      id: "calibratedPaleotemperatureC",
      label: "Calibrated paleotemperature c",
      kind: "number",
    },
    {
      id: "isotopeTemperatureAnomalyC",
      label: "Isotope temperature anomaly c",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      deltaO18Permil: value.deltaO18Permil as number,
      referenceDeltaO18Permil: value.referenceDeltaO18Permil as number,
      referenceTemperatureC: value.referenceTemperatureC as number,
      callerCalibrationPermilPerC: value.callerCalibrationPermilPerC as number,
    }),
});
export const run = tool.execute;
export default tool;
