import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../shared.js";
export type Input = Readonly<{
  readonly samplingMask: readonly (readonly number[])[];
  readonly fullySampledCalibrationMask: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly acquiredSamples: number;
  readonly nominalAcceleration: number;
  readonly calibrationCoverageComplete: boolean;
}>;
const inputFields = [
  { id: "samplingMask", label: "Sampling mask", kind: "matrix" },
  {
    id: "fullySampledCalibrationMask",
    label: "Fully sampled calibration mask",
    kind: "matrix",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const a = input.samplingMask,
    b = input.fullySampledCalibrationMask,
    n = a.length,
    m = a[0]?.length ?? 0;
  if (
    !n ||
    !m ||
    b.length !== n ||
    a.some((row) => row.length !== m) ||
    b.some((row) => row.length !== m)
  )
    simpleError(
      "samplingMask",
      "Aligned nonempty rectangular sampling/calibration masks required.",
    );
  if ([...a, ...b].some((row) => row.some((v) => v !== 0 && v !== 1)))
    simpleError("samplingMask", "Binary masks required.");
  const acquiredSamples = a.reduce(
    (s, row) => s + row.reduce((x, y) => x + y, 0),
    0,
  );
  positive(acquiredSamples, "samplingMask");
  return {
    acquiredSamples,
    nominalAcceleration: (n * m) / acquiredSamples,
    calibrationCoverageComplete: b.every((row, i) =>
      row.every((v, j) => v === 0 || a[i][j] === 1),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  samplingMask: [
    [1, 0, 1],
    [0, 1, 0],
  ],
  fullySampledCalibrationMask: [
    [1, 0, 0],
    [0, 1, 0],
  ],
} satisfies Input;
export const exampleOutput = {
  acquiredSamples: 3,
  nominalAcceleration: 2,
  calibrationCoverageComplete: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/binary-mask-compressed-sensing-coverage",
  title: "Compressed Sensing Acceleration",
  description:
    "Measure actual 2D sampling-mask acceleration and audit required calibration coverage; mask sparsity is not a compressed-sensing reconstructability guarantee.",
  inputs: inputFields,
  outputs: [
    { id: "acquiredSamples", label: "Acquired samples", kind: "number" },
    {
      id: "nominalAcceleration",
      label: "Nominal acceleration",
      kind: "number",
    },
    {
      id: "calibrationCoverageComplete",
      label: "Calibration coverage complete",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      samplingMask: value.samplingMask as readonly (readonly number[])[],
      fullySampledCalibrationMask:
        value.fullySampledCalibrationMask as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
