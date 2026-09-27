import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly angle: number;
  readonly negativeZero: boolean;
  readonly axis: string;
};
export type Output = {
  readonly hemisphere: string;
  readonly magnitude: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    angle: { type: "number" },
    negativeZero: { type: "boolean" },
    axis: { type: "string", maxLength: 8192, enum: ["latitude", "longitude"] },
  },
  required: ["angle", "negativeZero", "axis"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hemisphere: { type: "string", maxLength: 8192 },
    magnitude: { type: "number" },
  },
  required: ["hemisphere", "magnitude"],
} as const;
/** Choose a hemisphere with explicit signed-zero metadata, which survives JSON transport. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { angle, negativeZero, axis } = input;
  const compute = (): Output => {
    H.domain(["latitude", "longitude"].includes(axis));
    H.domain(angle !== 0 || typeof negativeZero === "boolean");
    const negative = angle < 0 || (angle === 0 && negativeZero);
    return {
      hemisphere:
        axis === "latitude" ? (negative ? "S" : "N") : negative ? "W" : "E",
      magnitude: Math.abs(angle),
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { angle: 0, negativeZero: true, axis: "longitude" },
  output: { hemisphere: "W", magnitude: 0 },
} satisfies ToolExample<Input, Output>;
export const angleNegativeZeroHemisphereLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "format/angle-negative-zero-hemisphere-label",
    title: "Angle Negative Zero Hemisphere Label Tool",
    description:
      "Choose a hemisphere with explicit signed-zero metadata, which survives JSON transport.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        angle: { type: "number" },
        negativeZero: { type: "boolean" },
        axis: {
          type: "string",
          maxLength: 8192,
          enum: ["latitude", "longitude"],
        },
      },
      required: ["angle", "negativeZero", "axis"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        hemisphere: { type: "string", maxLength: 8192 },
        magnitude: { type: "number" },
      },
      required: ["hemisphere", "magnitude"],
    },
    ports: {
      inputs: [
        {
          id: "angle",
          label: "Angle",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "negativeZero",
          label: "Negative Zero",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "axis",
          label: "Axis",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "hemisphere",
          label: "Hemisphere",
          valueType: { type: "string" },
        },
        { id: "magnitude", label: "Magnitude", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = angleNegativeZeroHemisphereLabelTool.execute;
export default angleNegativeZeroHemisphereLabelTool;
