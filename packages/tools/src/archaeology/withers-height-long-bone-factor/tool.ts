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
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly longBoneLengthsMm: readonly number[];
  readonly taxonElementCalibrationFactors: readonly number[];
  readonly calibrationOffsetsMm: readonly number[];
  readonly calibrationResidualSigmasMm: readonly number[];
}>;
export type Output = Readonly<{
  readonly modelWithersHeightsMm: readonly number[];
  readonly calibrationScenarioOneSigmaBoundsMm: readonly (readonly number[])[];
}>;
const inputFields = [
  {
    id: "longBoneLengthsMm",
    label: "Long bone lengths mm",
    kind: "numberList",
  },
  {
    id: "taxonElementCalibrationFactors",
    label: "Taxon element calibration factors",
    kind: "numberList",
  },
  {
    id: "calibrationOffsetsMm",
    label: "Calibration offsets mm",
    kind: "numberList",
  },
  {
    id: "calibrationResidualSigmasMm",
    label: "Calibration residual sigmas mm",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.longBoneLengthsMm.forEach((v) => positive(v, "longBoneLengthsMm"));
  input.taxonElementCalibrationFactors.forEach((v) =>
    positive(v, "taxonElementCalibrationFactors"),
  );
  input.calibrationResidualSigmasMm.forEach((v) =>
    nonnegative(v, "calibrationResidualSigmasMm"),
  );
  aligned(
    input.longBoneLengthsMm,
    input.taxonElementCalibrationFactors,
    "longBoneLengthsMm",
  );
  aligned(
    input.longBoneLengthsMm,
    input.calibrationOffsetsMm,
    "longBoneLengthsMm",
  );
  aligned(
    input.longBoneLengthsMm,
    input.calibrationResidualSigmasMm,
    "longBoneLengthsMm",
  );
  if (input.longBoneLengthsMm.length > 128)
    simpleError("bones", "At most 128 animal measurements supported.");
  const modelWithersHeightsMm = input.longBoneLengthsMm.map((v, i) =>
    positive(
      v * input.taxonElementCalibrationFactors[i] +
        input.calibrationOffsetsMm[i],
      "height",
    ),
  );
  return {
    modelWithersHeightsMm,
    calibrationScenarioOneSigmaBoundsMm: modelWithersHeightsMm.map((v, i) => [
      v - input.calibrationResidualSigmasMm[i],
      v + input.calibrationResidualSigmasMm[i],
    ]),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  longBoneLengthsMm: [100, 200],
  taxonElementCalibrationFactors: [2, 3],
  calibrationOffsetsMm: [0, 10],
  calibrationResidualSigmasMm: [5, 10],
} satisfies Input;
export const exampleOutput = {
  modelWithersHeightsMm: [200, 610],
  calibrationScenarioOneSigmaBoundsMm: [
    [195, 205],
    [600, 620],
  ],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/withers-height-long-bone-factor",
  title: "Withers Height Long Bone Factor",
  description:
    "Apply caller taxon/element-specific animal long-bone calibration with offsets/residual sigma; no embedded species coefficients or human stature inference, and residual bounds exclude length/calibration parameter uncertainty.",
  inputs: inputFields,
  outputs: [
    {
      id: "modelWithersHeightsMm",
      label: "Model withers heights mm",
      kind: "numberList",
    },
    {
      id: "calibrationScenarioOneSigmaBoundsMm",
      label: "Calibration scenario one sigma bounds mm",
      kind: "matrix",
    },
  ],
  calculate: (value) =>
    calculate({
      longBoneLengthsMm: value.longBoneLengthsMm as readonly number[],
      taxonElementCalibrationFactors:
        value.taxonElementCalibrationFactors as readonly number[],
      calibrationOffsetsMm: value.calibrationOffsetsMm as readonly number[],
      calibrationResidualSigmasMm:
        value.calibrationResidualSigmasMm as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
