import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch58-shared.js";
export type Input = Readonly<{
  innerRadiusMeters: number;
  outerRadiusMeters: number;
  reliefMeters: number;
  densityKgPerM3: number;
  angularWidthDegrees: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "innerRadiusMeters",
    label: "Inner radius meters",
    kind: "number",
    unit: "m",
  },
  {
    id: "outerRadiusMeters",
    label: "Outer radius meters",
    kind: "number",
    unit: "m",
  },
  { id: "reliefMeters", label: "Relief meters", kind: "number", unit: "m" },
  { id: "densityKgPerM3", label: "Density kg per m3", kind: "number" },
  {
    id: "angularWidthDegrees",
    label: "Angular width degrees",
    kind: "number",
    unit: "deg",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(
    i.innerRadiusMeters >= 0 &&
      i.outerRadiusMeters > i.innerRadiusMeters &&
      i.outerRadiusMeters <= 1e5 &&
      Math.abs(i.reliefMeters) <= 1e4 &&
      i.densityKgPerM3 > 0 &&
      i.densityKgPerM3 <= 10000 &&
      i.angularWidthDegrees > 0 &&
      i.angularWidthDegrees <= 360,
  );
  const h = Math.abs(i.reliefMeters);
  const verticalTerm =
    h === 0
      ? 0
      : h *
        h *
        (1 / (i.innerRadiusMeters + Math.hypot(i.innerRadiusMeters, h)) -
          1 / (i.outerRadiusMeters + Math.hypot(i.outerRadiusMeters, h)));
  return H.finish({
    terrainCorrectionMgal:
      2 *
      Math.PI *
      6.6743e-11 *
      i.densityKgPerM3 *
      (i.angularWidthDegrees / 360) *
      verticalTerm *
      1e5,
  });
};
export const example = {
  input: {
    innerRadiusMeters: 0,
    outerRadiusMeters: 4,
    reliefMeters: 3,
    densityKgPerM3: 1000,
    angularWidthDegrees: 360,
  },
  output: { result: { terrainCorrectionMgal: 0.08387172739141742 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geodesy/terrain-correction-hammer-zone-a",
  title: "Terrain Correction Simple Hammer Zone A Estimator",
  description:
    "Compute a flat-topped Hammer-style annular-sector terrain correction magnitude for supplied inner/outer radius, signed relief and density; no DEM sampling, fixed zone-A dimensions or complete terrain reduction.",
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
