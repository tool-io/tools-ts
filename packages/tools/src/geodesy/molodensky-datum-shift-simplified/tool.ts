import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch58-shared.js";
export type Input = Readonly<{
  semiMajorMeters: number;
  flattening: number;
  latitudeDegrees: number;
  longitudeDegrees: number;
  ellipsoidalHeightMeters: number;
  translationMeters: readonly number[];
  semiMajorDeltaMeters: number;
  flatteningDelta: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "semiMajorMeters",
    label: "Semi major meters",
    kind: "number",
    unit: "m",
  },
  { id: "flattening", label: "Flattening", kind: "number" },
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
    id: "ellipsoidalHeightMeters",
    label: "Ellipsoidal height meters",
    kind: "number",
    unit: "m",
  },
  {
    id: "translationMeters",
    label: "Translation meters",
    kind: "numberList",
    unit: "m",
  },
  {
    id: "semiMajorDeltaMeters",
    label: "Semi major delta meters",
    kind: "number",
    unit: "m",
  },
  { id: "flatteningDelta", label: "Flattening delta", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const p = H.ellipsoid(i.semiMajorMeters, i.flattening);
  const phi = H.latitude(i.latitudeDegrees);
  const lambda = H.longitude(i.longitudeDegrees);
  H.vector3(i.translationMeters);
  return H.finish(
    H.molodensky(
      p.a,
      p.f,
      phi,
      lambda,
      i.ellipsoidalHeightMeters,
      ...(i.translationMeters as [number, number, number]),
      i.semiMajorDeltaMeters,
      i.flatteningDelta,
    ),
  );
};
export const example = {
  input: {
    semiMajorMeters: 10,
    flattening: 0,
    latitudeDegrees: 0,
    longitudeDegrees: 0,
    ellipsoidalHeightMeters: 0,
    translationMeters: [1, 2, 3],
    semiMajorDeltaMeters: 0,
    flatteningDelta: 0,
  },
  output: {
    result: {
      latitudeDegrees: 17.188733853924695,
      longitudeDegrees: 11.459155902616466,
      ellipsoidalHeightMeters: 1,
      latitudeShiftArcseconds: 61879.441874128905,
      longitudeShiftArcseconds: 41252.96124941928,
      heightShiftMeters: 1,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Molodensky Datum Shift Simplified A-B-Delta Converter",
      "surveying",
    ],
    collections: ["data", "learn"],
    fields: ["geodesy", "surveying"],
    keywords: ["surveying"],
  },
  id: "geodesy/molodensky-datum-shift-simplified",
  title: "Molodensky Datum Shift Simplified A-B-Delta Converter",
  description:
    "Apply standard first-order Molodensky shifts using caller-established source ellipsoid, three translations and target-minus-source da/df; no built-in datum parameters, rotations or global accuracy guarantee.",
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
          latitudeDegrees: { type: "number" },
          longitudeDegrees: { type: "number" },
          ellipsoidalHeightMeters: { type: "number" },
          latitudeShiftArcseconds: { type: "number" },
          longitudeShiftArcseconds: { type: "number" },
          heightShiftMeters: { type: "number" },
        },
        required: [
          "latitudeDegrees",
          "longitudeDegrees",
          "ellipsoidalHeightMeters",
          "latitudeShiftArcseconds",
          "longitudeShiftArcseconds",
          "heightShiftMeters",
        ],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
