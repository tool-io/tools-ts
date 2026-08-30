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
  readonly translationsMm: readonly (readonly number[])[];
  readonly rotationsRadians: readonly (readonly number[])[];
  readonly rotationRadiusMm: number;
  readonly thresholdMm: number;
}>;
export type Output = Readonly<{
  readonly framewiseDisplacementsMm: readonly number[];
  readonly flaggedFrameIndexes: readonly number[];
}>;
const inputFields = [
  {
    id: "translationsMm",
    label: "Translations mm",
    kind: "matrix",
    unit: "mm",
  },
  { id: "rotationsRadians", label: "Rotations radians", kind: "matrix" },
  {
    id: "rotationRadiusMm",
    label: "Rotation radius mm",
    kind: "number",
    unit: "mm",
  },
  { id: "thresholdMm", label: "Threshold mm", kind: "number", unit: "mm" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(input.translationsMm, input.rotationsRadians, "translationsMm");
  if (
    input.translationsMm.length < 2 ||
    [...input.translationsMm, ...input.rotationsRadians].some(
      (row) => row.length !== 3,
    )
  )
    simpleError(
      "translationsMm",
      "At least two three-component rigid motion frames required.",
    );
  positive(input.rotationRadiusMm, "rotationRadiusMm");
  nonnegative(input.thresholdMm, "thresholdMm");
  const framewiseDisplacementsMm = input.translationsMm
    .slice(1)
    .map(
      (row, i) =>
        row.reduce(
          (s, v, j) => s + Math.abs(v - input.translationsMm[i][j]),
          0,
        ) +
        input.rotationRadiusMm *
          input.rotationsRadians[i + 1].reduce(
            (s, v, j) => s + Math.abs(v - input.rotationsRadians[i][j]),
            0,
          ),
    );
  return {
    framewiseDisplacementsMm,
    flaggedFrameIndexes: framewiseDisplacementsMm.flatMap((v, i) =>
      v > input.thresholdMm ? [i + 1] : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  translationsMm: [
    [0, 0, 0],
    [1, 0, 0],
    [1, 0, 0],
  ],
  rotationsRadians: [
    [0, 0, 0],
    [0, 0.01, 0],
    [0, 0.01, 0],
  ],
  rotationRadiusMm: 50,
  thresholdMm: 1,
} satisfies Input;
export const exampleOutput = {
  framewiseDisplacementsMm: [1.5, 0],
  flaggedFrameIndexes: [1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/rigid-framewise-displacement-screen",
  title: "Motion Artifact Checker",
  description:
    "Compute summed-absolute rigid framewise displacement with caller head-radius conversion and threshold; motion artifacts and motion correction quality are not diagnosed.",
  inputs: inputFields,
  outputs: [
    {
      id: "framewiseDisplacementsMm",
      label: "Framewise displacements mm",
      kind: "numberList",
      unit: "mm",
    },
    {
      id: "flaggedFrameIndexes",
      label: "Flagged frame indexes",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      translationsMm: value.translationsMm as readonly (readonly number[])[],
      rotationsRadians:
        value.rotationsRadians as readonly (readonly number[])[],
      rotationRadiusMm: value.rotationRadiusMm as number,
      thresholdMm: value.thresholdMm as number,
    }),
});
export const run = tool.execute;
export default tool;
