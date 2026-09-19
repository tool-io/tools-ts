import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch58-shared.js";
export type Input = Readonly<{
  latitudeDegrees: number;
  longitudeDegrees: number;
  centralMeridianDegrees: number;
  radiusMeters: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
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
  {
    id: "centralMeridianDegrees",
    label: "Central meridian degrees",
    kind: "number",
    unit: "deg",
  },
  { id: "radiusMeters", label: "Radius meters", kind: "number", unit: "m" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.latitude(i.latitudeDegrees);
  H.longitude(i.longitudeDegrees);
  H.longitude(i.centralMeridianDegrees);
  H.check(i.radiusMeters >= 1 && i.radiusMeters <= 1e8);
  const X = [
      1, 0.9986, 0.9954, 0.99, 0.9822, 0.973, 0.96, 0.9427, 0.9216, 0.8962,
      0.8679, 0.835, 0.7986, 0.7597, 0.7186, 0.6732, 0.6213, 0.5722, 0.5322,
    ],
    Y = [
      0, 0.062, 0.124, 0.186, 0.248, 0.31, 0.372, 0.434, 0.4958, 0.5571, 0.6176,
      0.6769, 0.7346, 0.7903, 0.8435, 0.8936, 0.9394, 0.9761, 1,
    ],
    u = Math.abs(i.latitudeDegrees) / 5,
    j = Math.min(17, Math.floor(u)),
    t = u - j,
    x = X[j] * (1 - t) + X[j + 1] * t,
    y = Y[j] * (1 - t) + Y[j + 1] * t,
    dl = H.rad(
      H.mod(i.longitudeDegrees - i.centralMeridianDegrees + 180, 360) - 180,
    );
  return H.finish({
    xMeters: 0.8487 * i.radiusMeters * dl * x,
    yMeters: 1.3523 * i.radiusMeters * Math.sign(i.latitudeDegrees) * y,
    xMultiplier: x,
    yMultiplier: Math.sign(i.latitudeDegrees) * y,
    interpolation:
      "linear interpolation of the published 5-degree Robinson table",
  });
};
export const example = {
  input: {
    latitudeDegrees: 0,
    longitudeDegrees: 0,
    centralMeridianDegrees: 0,
    radiusMeters: 1,
  },
  output: {
    result: {
      xMeters: 0,
      yMeters: 0,
      xMultiplier: 1,
      yMultiplier: 0,
      interpolation:
        "linear interpolation of the published 5-degree Robinson table",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geodesy/robinson-table-interpolation-note-generator",
  title: "Robinson Projection Table Interpolation Pseudocylindrical Note",
  description:
    "Interpolate the published Robinson 5-degree coefficient table linearly and project spherical coordinates; explicitly not conformal/equal-area or identical to PROJ cubic interpolation between knots.",
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
