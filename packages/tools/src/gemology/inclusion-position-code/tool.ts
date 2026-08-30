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
  fraction,
  shape,
  bands,
} from "../shared.js";
export type Input = Readonly<{
  readonly inclusionPositionsXyDepthMm: readonly (readonly number[])[];
  readonly stoneOutlineRadiusMm: number;
  readonly stoneDepthMm: number;
  readonly callerRadialZoneLowerEdges: readonly number[];
  readonly callerDepthZoneLowerEdges: readonly number[];
}>;
export type Output = Readonly<{
  readonly normalizedInclusionRadii: readonly number[];
  readonly normalizedInclusionDepths: readonly number[];
  readonly callerInclusionPositionZoneCodes: readonly (readonly number[])[];
}>;
const inputFields = [
  {
    id: "inclusionPositionsXyDepthMm",
    label: "Inclusion positions xy depth mm",
    kind: "matrix",
  },
  {
    id: "stoneOutlineRadiusMm",
    label: "Stone outline radius mm",
    kind: "number",
  },
  { id: "stoneDepthMm", label: "Stone depth mm", kind: "number" },
  {
    id: "callerRadialZoneLowerEdges",
    label: "Caller radial zone lower edges",
    kind: "numberList",
  },
  {
    id: "callerDepthZoneLowerEdges",
    label: "Caller depth zone lower edges",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.stoneOutlineRadiusMm, "stoneOutlineRadiusMm");
  positive(input.stoneDepthMm, "stoneDepthMm");
  if (shape(input.inclusionPositionsXyDepthMm, "inclusions") !== 3)
    simpleError(
      "inclusions",
      "Measured x/y/depth triples from caller centered circular outline required.",
    );
  const radii = input.inclusionPositionsXyDepthMm.map((row) =>
      fraction(
        Math.hypot(row[0], row[1]) / input.stoneOutlineRadiusMm,
        "radius",
      ),
    ),
    depths = input.inclusionPositionsXyDepthMm.map((row) =>
      fraction(row[2] / input.stoneDepthMm, "depth"),
    );
  return {
    normalizedInclusionRadii: radii,
    normalizedInclusionDepths: depths,
    callerInclusionPositionZoneCodes: radii.map((v, i) => [
      bands(input.callerRadialZoneLowerEdges, v),
      bands(input.callerDepthZoneLowerEdges, depths[i]),
    ]),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  inclusionPositionsXyDepthMm: [
    [0, 0, 1],
    [3, 4, 3],
  ],
  stoneOutlineRadiusMm: 5,
  stoneDepthMm: 4,
  callerRadialZoneLowerEdges: [0, 0.5, 0.9],
  callerDepthZoneLowerEdges: [0, 0.5, 0.9],
} satisfies Input;
export const exampleOutput = {
  normalizedInclusionRadii: [0, 1],
  normalizedInclusionDepths: [0.25, 0.75],
  callerInclusionPositionZoneCodes: [
    [0, 0],
    [2, 1],
  ],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/inclusion-position-code",
  title: "Clarity Inclusion Position Map Code",
  description:
    "Encode measured inclusion locations into caller radial/depth zones under explicit centered circular envelope; no clarity grade, inclusion composition or visibility/structural-safety conclusion.",
  inputs: inputFields,
  outputs: [
    {
      id: "normalizedInclusionRadii",
      label: "Normalized inclusion radii",
      kind: "numberList",
    },
    {
      id: "normalizedInclusionDepths",
      label: "Normalized inclusion depths",
      kind: "numberList",
    },
    {
      id: "callerInclusionPositionZoneCodes",
      label: "Caller inclusion position zone codes",
      kind: "matrix",
    },
  ],
  calculate: (value) =>
    calculate({
      inclusionPositionsXyDepthMm:
        value.inclusionPositionsXyDepthMm as readonly (readonly number[])[],
      stoneOutlineRadiusMm: value.stoneOutlineRadiusMm as number,
      stoneDepthMm: value.stoneDepthMm as number,
      callerRadialZoneLowerEdges:
        value.callerRadialZoneLowerEdges as readonly number[],
      callerDepthZoneLowerEdges:
        value.callerDepthZoneLowerEdges as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
