import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch58-shared.js";
export type Input = Readonly<{
  forwardAzimuthDegrees: number;
  backAzimuthDegrees: number;
  toleranceDegrees: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "forwardAzimuthDegrees",
    label: "Forward azimuth degrees",
    kind: "number",
    unit: "deg",
  },
  {
    id: "backAzimuthDegrees",
    label: "Back azimuth degrees",
    kind: "number",
    unit: "deg",
  },
  {
    id: "toleranceDegrees",
    label: "Tolerance degrees",
    kind: "number",
    unit: "deg",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.check(
    i.forwardAzimuthDegrees >= 0 &&
      i.forwardAzimuthDegrees < 360 &&
      i.backAzimuthDegrees >= 0 &&
      i.backAzimuthDegrees < 360 &&
      i.toleranceDegrees >= 0 &&
      i.toleranceDegrees <= 180,
  );
  const expected = H.mod(i.forwardAzimuthDegrees + 180, 360),
    delta = H.mod(i.backAzimuthDegrees - expected + 180, 360) - 180;
  return H.finish({
    expectedBackAzimuthDegrees: expected,
    signedDiscrepancyDegrees: delta,
    flag: Math.abs(delta) > i.toleranceDegrees,
  });
};
export const example = {
  input: {
    forwardAzimuthDegrees: 10,
    backAzimuthDegrees: 195,
    toleranceDegrees: 2,
  },
  output: {
    result: {
      expectedBackAzimuthDegrees: 190,
      signedDiscrepancyDegrees: 5,
      flag: true,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Reciprocal Azimuth Difference Blunder Flag Checker",
      "surveying",
    ],
    collections: ["data", "learn"],
    fields: ["geodesy", "surveying"],
    keywords: ["surveying"],
  },
  id: "geodesy/reciprocal-azimuth-blunder-flag-checker",
  title: "Reciprocal Azimuth Difference Blunder Flag Checker",
  description:
    "Flag supplied local forward/back azimuth reciprocity discrepancies against an explicit tolerance, preserving signed angular wrap; distant geodesic endpoints need not have exact reciprocal bearings.",
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
          expectedBackAzimuthDegrees: { type: "number" },
          signedDiscrepancyDegrees: { type: "number" },
          flag: { type: "boolean" },
        },
        required: [
          "expectedBackAzimuthDegrees",
          "signedDiscrepancyDegrees",
          "flag",
        ],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
