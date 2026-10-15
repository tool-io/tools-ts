import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch58-shared.js";
export type Input = Readonly<{
  latitudeDegrees: number;
  longitudeDegrees: number;
  radiusMeters: number;
  relativeTolerance: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "latitudeDegrees",
    label: "Latitude degrees",
    kind: "number",
    unit: "deg",
  },
  {
    id: "longitudeDegrees",
    label: "Longitude degrees",
    kind: "number",
    unit: "deg",
  },
  { id: "radiusMeters", label: "Radius meters", kind: "number", unit: "m" },
  { id: "relativeTolerance", label: "Relative tolerance", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const phi = H.latitude(i.latitudeDegrees),
    lam = H.longitude(i.longitudeDegrees);
  H.check(
    Math.abs(i.latitudeDegrees) <= 85 &&
      i.radiusMeters >= 1 &&
      i.radiusMeters <= 1e8 &&
      i.relativeTolerance >= 0 &&
      i.relativeTolerance <= 0.1,
  );
  const h = 1e-5,
    R = i.radiusMeters,
    center = H.mollweide(phi, lam, R),
    xp = H.mollweide(phi, lam + h, R),
    xm = H.mollweide(phi, lam - h, R),
    yp = H.mollweide(phi + h, lam, R),
    ym = H.mollweide(phi - h, lam, R),
    dxdl = (xp[0] - xm[0]) / (2 * h),
    dydl = (xp[1] - xm[1]) / (2 * h),
    dxdp = (yp[0] - ym[0]) / (2 * h),
    dydp = (yp[1] - ym[1]) / (2 * h),
    jacobian = dxdl * dydp - dxdp * dydl,
    error = Math.abs(jacobian / (R * R * Math.cos(phi)) - 1);
  return H.finish({
    projectedMeters: center,
    relativeAreaError: error,
    withinTolerance: error <= i.relativeTolerance,
  });
};
export const example = {
  input: {
    latitudeDegrees: 0,
    longitudeDegrees: 0,
    radiusMeters: 1,
    relativeTolerance: 1e-6,
  },
  output: {
    result: {
      projectedMeters: [0, 0],
      // Finite-difference estimate, not an exact symbolic area identity.
      relativeAreaError: 6.3967720009827644e-12,
      withinTolerance: true,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Mollweide Projection Area Conservation Spot Checker",
      "surveying",
    ],
    collections: ["data", "learn"],
    fields: ["geodesy", "surveying"],
    keywords: ["surveying"],
  },
  id: "geodesy/mollweide-area-conservation-spot-checker",
  title: "Mollweide Projection Area Conservation Spot Checker",
  description:
    "Spot-check spherical Mollweide equal-area behavior using finite-difference Jacobian of the actual forward map, not a hardcoded area identity; |latitude|<=85, local differential check only.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit geodesy result; see field names for units",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          projectedMeters: { type: "array", items: { type: "number" } },
          relativeAreaError: { type: "number" },
          withinTolerance: { type: "boolean" },
        },
        required: ["projectedMeters", "relativeAreaError", "withinTolerance"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
