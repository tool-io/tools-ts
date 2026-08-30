import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly sampleSignal: number;
  readonly calibrationIntercept: number;
  readonly calibrationSlope: number;
}>;
export type Output = Readonly<{
  readonly backCalculatedConcentration: number;
  readonly reconstructedSignal: number;
}>;
export const calculate = (input: Input): Output => {
  if (input.calibrationSlope === 0)
    simpleError("calibrationSlope", "Calibration slope must be nonzero.");
  const backCalculatedConcentration =
    (input.sampleSignal - input.calibrationIntercept) / input.calibrationSlope;
  return {
    backCalculatedConcentration,
    reconstructedSignal:
      backCalculatedConcentration * input.calibrationSlope +
      input.calibrationIntercept,
  };
};
export const exampleInput = {
  sampleSignal: 25,
  calibrationIntercept: 5,
  calibrationSlope: 10,
} satisfies Input;
export const exampleOutput = {
  backCalculatedConcentration: 2,
  reconstructedSignal: 25,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/calibration-backcalculation",
  title: "Calibration Backcalculation",
  description:
    "Invert a linear calibration curve to estimate sample concentration.",
  inputs: [
    { id: "sampleSignal", kind: "number", label: "Sample signal" },
    {
      id: "calibrationIntercept",
      kind: "number",
      label: "Calibration intercept",
    },
    { id: "calibrationSlope", kind: "number", label: "Calibration slope" },
  ],
  outputs: [
    {
      id: "backCalculatedConcentration",
      kind: "number",
      label: "Back calculated concentration",
    },
    {
      id: "reconstructedSignal",
      kind: "number",
      label: "Reconstructed signal",
    },
  ],
  calculate: (value) =>
    calculate({
      sampleSignal: value.sampleSignal as number,
      calibrationIntercept: value.calibrationIntercept as number,
      calibrationSlope: value.calibrationSlope as number,
    }),
});
export const run = tool.execute;
export default tool;
