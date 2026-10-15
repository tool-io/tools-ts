import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch58-shared.js";
export type Input = Readonly<{
  lengthsMeters: readonly number[];
  azimuthsDegrees: readonly number[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "lengthsMeters",
    label: "Lengths meters",
    kind: "numberList",
    unit: "m",
  },
  {
    id: "azimuthsDegrees",
    label: "Azimuths degrees",
    kind: "numberList",
    unit: "deg",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const t = H.traverse(i.lengthsMeters, i.azimuthsDegrees);
  return H.finish({
    northMeters: t.north,
    eastMeters: t.east,
    closureNorthMeters: t.closureNorth,
    closureEastMeters: t.closureEast,
    perimeterMeters: t.perimeter,
    misclosureMeters: t.misclosure,
  });
};
export const example = {
  input: { lengthsMeters: [1, 1], azimuthsDegrees: [0, 90] },
  output: {
    result: {
      northMeters: [1, 0],
      eastMeters: [0, 1],
      closureNorthMeters: 1,
      closureEastMeters: 1,
      perimeterMeters: 2,
      misclosureMeters: 1.4142135623730951,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Traverse Misclosure Lat Departure Closure Calculator",
      "surveying",
    ],
    collections: ["data", "learn"],
    fields: ["geodesy", "surveying"],
    keywords: ["surveying"],
  },
  id: "geodesy/traverse-misclosure-lat-dep-closure",
  title: "Traverse Misclosure Lat Departure Closure Calculator",
  description:
    "Compute local traverse latitude/northing and departure/easting increments with azimuth clockwise from north, plus signed loop misclosure and perimeter; no geodesic propagation or automatic adjustment.",
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
          northMeters: { type: "array", items: { type: "number" } },
          eastMeters: { type: "array", items: { type: "number" } },
          closureNorthMeters: { type: "number" },
          closureEastMeters: { type: "number" },
          perimeterMeters: { type: "number" },
          misclosureMeters: { type: "number" },
        },
        required: [
          "northMeters",
          "eastMeters",
          "closureNorthMeters",
          "closureEastMeters",
          "perimeterMeters",
          "misclosureMeters",
        ],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
