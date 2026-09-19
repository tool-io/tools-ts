import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch58-shared.js";
export type Input = Readonly<{
  closureMm: number;
  distanceKm: number;
  coefficientMmPerSqrtKm: number;
  gradeDefinition: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "closureMm", label: "Closure mm", kind: "number", unit: "mm" },
  { id: "distanceKm", label: "Distance km", kind: "number", unit: "km" },
  {
    id: "coefficientMmPerSqrtKm",
    label: "Coefficient mm per sqrt km",
    kind: "number",
    unit: "km",
  },
  { id: "gradeDefinition", label: "Grade definition", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(
    i.distanceKm > 0 &&
      i.distanceKm <= 1e5 &&
      i.coefficientMmPerSqrtKm > 0 &&
      i.coefficientMmPerSqrtKm <= 1000 &&
      i.gradeDefinition.trim().length > 0,
  );
  H.magnitude(i.closureMm, 1e6);
  const allowed = i.coefficientMmPerSqrtKm * Math.sqrt(i.distanceKm);
  return H.finish({
    allowedMm: allowed,
    withinCallerTolerance: Math.abs(i.closureMm) <= allowed,
    excessMm: Math.max(0, Math.abs(i.closureMm) - allowed),
    gradeDefinition: i.gradeDefinition,
  });
};
export const example = {
  input: {
    closureMm: 3,
    distanceKm: 4,
    coefficientMmPerSqrtKm: 2,
    gradeDefinition: "illustrative caller criterion",
  },
  output: {
    result: {
      allowedMm: 4,
      withinCallerTolerance: true,
      excessMm: 0,
      gradeDefinition: "illustrative caller criterion",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geodesy/leveling-loop-closure-grade-checker",
  title: "Leveling Loop Closure mm per km Grade Checker",
  description:
    "Check absolute leveling loop closure against a caller-established coefficient*sqrt(distanceKm) criterion; reports the supplied grade definition, not an invented jurisdictional grade or survey certification.",
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
