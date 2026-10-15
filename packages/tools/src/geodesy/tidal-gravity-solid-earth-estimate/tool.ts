import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch58-shared.js";
export type Input = Readonly<{
  bodyGm: readonly number[];
  bodyDistanceMeters: readonly number[];
  bodyZenithDegrees: readonly number[];
  earthRadiusMeters: number;
  loveH2: number;
  loveK2: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "bodyGm", label: "Body gm", kind: "numberList" },
  {
    id: "bodyDistanceMeters",
    label: "Body distance meters",
    kind: "numberList",
    unit: "m",
  },
  {
    id: "bodyZenithDegrees",
    label: "Body zenith degrees",
    kind: "numberList",
    unit: "deg",
  },
  {
    id: "earthRadiusMeters",
    label: "Earth radius meters",
    kind: "number",
    unit: "m",
  },
  { id: "loveH2", label: "Love h2", kind: "number" },
  { id: "loveK2", label: "Love k2", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.check(
    i.bodyGm.length > 0 &&
      i.bodyGm.length <= 8 &&
      i.bodyGm.length === i.bodyDistanceMeters.length &&
      i.bodyGm.length === i.bodyZenithDegrees.length &&
      i.earthRadiusMeters >= 1e6 &&
      i.earthRadiusMeters <= 1e7 &&
      i.loveH2 >= 0 &&
      i.loveH2 <= 1 &&
      i.loveK2 >= 0 &&
      i.loveK2 <= 0.5,
  );
  let outward = 0;
  const factor = 1 + i.loveH2 - 1.5 * i.loveK2;
  H.check(factor > 0);
  i.bodyGm.forEach((gm, j) => {
    H.check(
      gm > 0 &&
        gm <= 2e20 &&
        i.bodyDistanceMeters[j] >= 10 * i.earthRadiusMeters &&
        i.bodyDistanceMeters[j] <= 1e13 &&
        i.bodyZenithDegrees[j] >= 0 &&
        i.bodyZenithDegrees[j] <= 180,
    );
    outward +=
      ((gm * i.earthRadiusMeters) / i.bodyDistanceMeters[j] ** 3) *
      (3 * Math.cos(H.rad(i.bodyZenithDegrees[j])) ** 2 - 1);
  });
  return H.finish({
    gravimetricFactor: factor,
    tidalDownGravityChangeMicrogal: -outward * factor * 1e8,
    correctionToObservedMicrogal: outward * factor * 1e8,
  });
};
export const example = {
  input: {
    bodyGm: [100000000000000.0],
    bodyDistanceMeters: [100000000.0],
    bodyZenithDegrees: [0],
    earthRadiusMeters: 1000000.0,
    loveH2: 0.6,
    loveK2: 0.3,
  },
  output: {
    result: {
      gravimetricFactor: 1.15,
      tidalDownGravityChangeMicrogal: -23000,
      correctionToObservedMicrogal: 23000,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Tidal Gravity Correction Solid Earth Tide Estimate Calculator",
      "surveying",
    ],
    collections: ["data", "learn"],
    fields: ["geodesy", "surveying"],
    keywords: ["surveying"],
  },
  id: "geodesy/tidal-gravity-solid-earth-estimate",
  title: "Tidal Gravity Correction Solid Earth Tide Estimate Calculator",
  description:
    "Estimate degree-two solid-Earth tidal gravity from supplied external-body GM/distances/zeniths and gravimetric factor 1+h2-1.5k2; downward-positive gravity and opposite removal correction, not full IERS tides or ephemerides.",
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
          gravimetricFactor: { type: "number" },
          tidalDownGravityChangeMicrogal: { type: "number" },
          correctionToObservedMicrogal: { type: "number" },
        },
        required: [
          "gravimetricFactor",
          "tidalDownGravityChangeMicrogal",
          "correctionToObservedMicrogal",
        ],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
