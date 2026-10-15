import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch58-shared.js";
export type Input = Readonly<{
  latitudeDegrees: number;
  longitudeDegrees: number;
  ecefDeltaMeters: readonly number[];
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
  {
    id: "ecefDeltaMeters",
    label: "Ecef delta meters",
    kind: "numberList",
    unit: "m",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const phi = H.latitude(i.latitudeDegrees),
    lambda = H.longitude(i.longitudeDegrees);
  H.vector3(i.ecefDeltaMeters);
  const [x, y, z] = i.ecefDeltaMeters,
    sp = Math.sin(phi),
    cp = Math.cos(phi),
    sl = Math.sin(lambda),
    cl = Math.cos(lambda);
  return H.finish({
    enuMeters: [
      -sl * x + cl * y,
      -sp * cl * x - sp * sl * y + cp * z,
      cp * cl * x + cp * sl * y + sp * z,
    ],
  });
};
export const example = {
  input: {
    latitudeDegrees: 0,
    longitudeDegrees: 0,
    ecefDeltaMeters: [1, 2, 3],
  },
  output: { result: { enuMeters: [2, 3, 1] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["ENU Local Tangent Plane Component Converter", "surveying"],
    collections: ["data", "learn"],
    fields: ["geodesy", "surveying"],
    keywords: ["surveying"],
  },
  id: "geodesy/enu-local-tangent-converter",
  title: "ENU Local Tangent Plane Component Converter",
  description:
    "Rotate an ECEF displacement vector into ellipsoidal East/North/Up at an explicit origin latitude/longitude; input is a delta, not an absolute position or a datum transformation.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit geodesy result; see field names for units",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { enuMeters: { type: "array", items: { type: "number" } } },
        required: ["enuMeters"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
