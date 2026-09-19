import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch58-shared.js";
export type Input = Readonly<{
  ecefMeters: readonly number[];
  translationMeters: readonly number[];
  rotationArcseconds: readonly number[];
  scalePpm: number;
  convention: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "ecefMeters", label: "Ecef meters", kind: "numberList", unit: "m" },
  {
    id: "translationMeters",
    label: "Translation meters",
    kind: "numberList",
    unit: "m",
  },
  {
    id: "rotationArcseconds",
    label: "Rotation arcseconds",
    kind: "numberList",
    unit: "arcsec",
  },
  { id: "scalePpm", label: "Scale ppm", kind: "number", unit: "ppm" },
  { id: "convention", label: "Convention", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({
    ecefMeters: H.helmert(
      i.ecefMeters,
      i.translationMeters,
      i.rotationArcseconds,
      i.scalePpm,
      i.convention,
    ),
  });
};
export const example = {
  input: {
    ecefMeters: [1, 2, 3],
    translationMeters: [1, 1, 1],
    rotationArcseconds: [0, 0, 0],
    scalePpm: 0,
    convention: "position-vector",
  },
  output: { result: { ecefMeters: [2, 3, 4] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geodesy/helmert-transform-applier",
  title: "Helmert Transform Coordinate Rotation Applier",
  description:
    "Apply a static seven-parameter small-angle 3D Helmert in explicit position-vector or coordinate-frame convention; rotations arcseconds, scale ppm, no guessed datum/epoch or kinematic rates.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit geodesy result; see field names for units",
      kind: "object",
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
