import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch58-shared.js";
export type Input = Readonly<{
  firstUndulationMeters: number;
  secondUndulationMeters: number;
  distanceKm: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "firstUndulationMeters",
    label: "First undulation meters",
    kind: "number",
    unit: "m",
  },
  {
    id: "secondUndulationMeters",
    label: "Second undulation meters",
    kind: "number",
    unit: "m",
  },
  { id: "distanceKm", label: "Distance km", kind: "number", unit: "km" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(
    Math.abs(i.firstUndulationMeters) <= 1000 &&
      Math.abs(i.secondUndulationMeters) <= 1000 &&
      i.distanceKm > 0 &&
      i.distanceKm <= 1e4,
  );
  return H.finish({
    signedMetersPerKm:
      (i.secondUndulationMeters - i.firstUndulationMeters) / i.distanceKm,
    dimensionlessSlope:
      (i.secondUndulationMeters - i.firstUndulationMeters) /
      (1000 * i.distanceKm),
  });
};
export const example = {
  input: {
    firstUndulationMeters: 10,
    secondUndulationMeters: 12,
    distanceKm: 2,
  },
  output: { result: { signedMetersPerKm: 1, dimensionlessSlope: 0.001 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geodesy/geoid-separation-gradient-estimator",
  title: "Geoid Separation Gradient per km Estimator",
  description:
    "Estimate directional geoid-undulation gradient from same-model/same-epoch endpoint values and explicit positive ground separation; not a global geoid model or automatic vertical deflection.",
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
