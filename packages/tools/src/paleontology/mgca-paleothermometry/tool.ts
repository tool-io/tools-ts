import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly measuredMgCaRatio: number;
  readonly exponentialCalibrationScale: number;
  readonly exponentialTemperatureSlopePerC: number;
  readonly calibrationTemperatureBoundsC: readonly number[];
  readonly ratioSigma: number;
}>;
export type Output = Readonly<{
  readonly modelTemperatureC: number;
  readonly measurementTemperatureSigmaC: number;
}>;
const inputFields = [
  { id: "measuredMgCaRatio", label: "Measured mg ca ratio", kind: "number" },
  {
    id: "exponentialCalibrationScale",
    label: "Exponential calibration scale",
    kind: "number",
  },
  {
    id: "exponentialTemperatureSlopePerC",
    label: "Exponential temperature slope per c",
    kind: "number",
  },
  {
    id: "calibrationTemperatureBoundsC",
    label: "Calibration temperature bounds c",
    kind: "numberList",
  },
  { id: "ratioSigma", label: "Ratio sigma", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.measuredMgCaRatio, "measuredMgCaRatio");
  positive(input.exponentialCalibrationScale, "exponentialCalibrationScale");
  positive(
    input.exponentialTemperatureSlopePerC,
    "exponentialTemperatureSlopePerC",
  );
  nonnegative(input.ratioSigma, "ratioSigma");
  if (
    input.calibrationTemperatureBoundsC.length !== 2 ||
    input.calibrationTemperatureBoundsC[0] >
      input.calibrationTemperatureBoundsC[1]
  )
    simpleError("bounds", "Two ordered Celsius calibration bounds required.");
  const modelTemperatureC =
    (Math.log(input.measuredMgCaRatio) -
      Math.log(input.exponentialCalibrationScale)) /
    input.exponentialTemperatureSlopePerC;
  if (
    modelTemperatureC < input.calibrationTemperatureBoundsC[0] ||
    modelTemperatureC > input.calibrationTemperatureBoundsC[1]
  )
    simpleError(
      "temperature",
      "Outside caller taxon-specific Mg/Ca calibration range.",
    );
  return {
    modelTemperatureC,
    measurementTemperatureSigmaC:
      input.ratioSigma /
      input.measuredMgCaRatio /
      input.exponentialTemperatureSlopePerC,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredMgCaRatio: 7.38905609893065,
  exponentialCalibrationScale: 1,
  exponentialTemperatureSlopePerC: 0.1,
  calibrationTemperatureBoundsC: [0, 30],
  ratioSigma: 0.1,
} satisfies Input;
export const exampleOutput = {
  modelTemperatureC: 20,
  measurementTemperatureSigmaC: 0.1353352832366127,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleontology/mgca-paleothermometry",
  title: "Mg/Ca Paleothermometry",
  description:
    "Invert caller Mg/Ca=A exp(B T_C) with calibration-domain guard and ratio-only uncertainty; units/taxon/calcification-depth and dissolution effects remain explicit external assumptions.",
  inputs: inputFields,
  outputs: [
    { id: "modelTemperatureC", label: "Model temperature c", kind: "number" },
    {
      id: "measurementTemperatureSigmaC",
      label: "Measurement temperature sigma c",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredMgCaRatio: value.measuredMgCaRatio as number,
      exponentialCalibrationScale: value.exponentialCalibrationScale as number,
      exponentialTemperatureSlopePerC:
        value.exponentialTemperatureSlopePerC as number,
      calibrationTemperatureBoundsC:
        value.calibrationTemperatureBoundsC as readonly number[],
      ratioSigma: value.ratioSigma as number,
    }),
});
export const run = tool.execute;
export default tool;
