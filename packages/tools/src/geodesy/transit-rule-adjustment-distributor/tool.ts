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
  return H.finish(H.adjustTraverse(i.lengthsMeters, i.azimuthsDegrees, true));
};
export const example = {
  input: { lengthsMeters: [1, 1], azimuthsDegrees: [0, 0] },
  output: {
    result: {
      originalClosureNorthMeters: 2,
      originalClosureEastMeters: 0,
      correctionsNorthMeters: [-1, -1],
      correctionsEastMeters: [0, 0],
      northMeters: [0, 0],
      eastMeters: [0, 0],
      coordinatesEastNorthMeters: [
        [0, 0],
        [0, 0],
        [0, 0],
      ],
      residualMeters: 0,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Transit Rule Alternative Adjustment Distributor", "surveying"],
    collections: ["data", "learn"],
    fields: ["geodesy", "surveying"],
    keywords: ["surveying"],
  },
  id: "geodesy/transit-rule-adjustment-distributor",
  title: "Transit Rule Alternative Adjustment Distributor",
  description:
    "Apply the local transit rule, distributing coordinate closure proportional to absolute component increments; returns component corrections and adjusted coordinates, not least-squares network accuracy.",
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
          originalClosureNorthMeters: { type: "number" },
          originalClosureEastMeters: { type: "number" },
          correctionsNorthMeters: { type: "array", items: { type: "number" } },
          correctionsEastMeters: { type: "array", items: { type: "number" } },
          northMeters: { type: "array", items: { type: "number" } },
          eastMeters: { type: "array", items: { type: "number" } },
          coordinatesEastNorthMeters: {
            type: "array",
            items: {
              type: "array",
              items: { type: "number" },
              minItems: 2,
              maxItems: 2,
            },
          },
          residualMeters: { type: "number" },
        },
        required: [
          "originalClosureNorthMeters",
          "originalClosureEastMeters",
          "correctionsNorthMeters",
          "correctionsEastMeters",
          "northMeters",
          "eastMeters",
          "coordinatesEastNorthMeters",
          "residualMeters",
        ],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
