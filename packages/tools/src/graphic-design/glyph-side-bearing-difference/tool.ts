import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly leftBearing: number;
  readonly rightBearing: number;
};
export type Output = { readonly rightMinusLeft: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftBearing: { type: "number" },
    rightBearing: { type: "number" },
  },
  required: ["leftBearing", "rightBearing"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { rightMinusLeft: { type: "number" } },
  required: ["rightMinusLeft"],
} as const;
/** Compare explicit glyph side bearings in the same design-unit coordinate system. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { leftBearing, rightBearing } = request;
  const compute = (): Output => {
    return { rightMinusLeft: rightBearing - leftBearing };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { leftBearing: 20, rightBearing: 35 },
  output: { rightMinusLeft: 15 },
} satisfies ToolExample<Input, Output>;
export const glyphSideBearingDifferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["graphic-design", "graphic design", "arts and design"],
      keywords: ["graphic design", "arts and design"],
    },
    id: "graphic-design/glyph-side-bearing-difference",
    title: "Glyph Side Bearing Difference",
    description:
      "Compare explicit glyph side bearings in the same design-unit coordinate system.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leftBearing: { type: "number" },
        rightBearing: { type: "number" },
      },
      required: ["leftBearing", "rightBearing"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { rightMinusLeft: { type: "number" } },
      required: ["rightMinusLeft"],
    },
    ports: {
      inputs: [
        {
          id: "leftBearing",
          label: "Left Bearing",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rightBearing",
          label: "Right Bearing",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "rightMinusLeft",
          label: "Right Minus Left",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = glyphSideBearingDifferenceTool.execute;
export default glyphSideBearingDifferenceTool;
