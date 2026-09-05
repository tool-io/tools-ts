import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  canvas,
  unitPoints,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly viewerLeftHalfPoints: readonly (readonly number[])[];
  readonly viewerRightHalfPoints: readonly (readonly number[])[];
  readonly fieldWidth: number;
  readonly fieldHeight: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "viewerLeftHalfPoints",
    label: "Viewer left half points",
    kind: "matrix",
  },
  {
    id: "viewerRightHalfPoints",
    label: "Viewer right half points",
    kind: "matrix",
  },
  { id: "fieldWidth", label: "Field width", kind: "number" },
  { id: "fieldHeight", label: "Field height", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  canvas(input.fieldWidth, input.fieldHeight);
  unitPoints(input.viewerLeftHalfPoints);
  unitPoints(input.viewerRightHalfPoints);
  return {
    leftMappedPoints: input.viewerLeftHalfPoints.map(([x, y]) => [
      (x * input.fieldWidth) / 2,
      y * input.fieldHeight,
    ]),
    rightMappedPoints: input.viewerRightHalfPoints.map(([x, y]) => [
      ((1 + x) * input.fieldWidth) / 2,
      y * input.fieldHeight,
    ]),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    viewerLeftHalfPoints: [
      [0, 0],
      [1, 1],
    ],
    viewerRightHalfPoints: [
      [0, 0],
      [1, 1],
    ],
    fieldWidth: 100,
    fieldHeight: 120,
  },
  output: {
    result: {
      leftMappedPoints: [
        [0, 0],
        [50, 120],
      ],
      rightMappedPoints: [
        [50, 0],
        [100, 120],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "heraldry/dimidiation-half-merge-solver",
  title: "Dimidiation Half-Seam Merge Coordinate Solver",
  description:
    "Map already normalized half-armorial coordinates across a dimidiation seam; no automatic crop, charge repair or grant approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
