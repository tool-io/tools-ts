import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly azimuthWidthRadians: number;
  readonly lowerCosPolar: number;
  readonly upperCosPolar: number;
};
export type Output = { readonly solidAngleSteradians: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    azimuthWidthRadians: { type: "number", minimum: 0 },
    lowerCosPolar: { type: "number", minimum: -1, maximum: 1 },
    upperCosPolar: { type: "number", minimum: -1 },
  },
  required: ["azimuthWidthRadians", "lowerCosPolar", "upperCosPolar"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { solidAngleSteradians: { type: "number" } },
  required: ["solidAngleSteradians"],
} as const;
/** Compute a spherical angular-bin solid angle from explicit cosine-polar bounds and azimuth width. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { azimuthWidthRadians, lowerCosPolar, upperCosPolar } = request;
  const compute = (): Output => {
    H.domain(
      azimuthWidthRadians >= 0 &&
        azimuthWidthRadians <= 2 * Math.PI &&
        lowerCosPolar >= -1 &&
        lowerCosPolar <= 1 &&
        upperCosPolar >= -1 &&
        upperCosPolar <= lowerCosPolar,
    );
    return {
      solidAngleSteradians:
        azimuthWidthRadians * (lowerCosPolar - upperCosPolar),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { azimuthWidthRadians: 2, lowerCosPolar: 1, upperCosPolar: 0.5 },
  output: { solidAngleSteradians: 1 },
} satisfies ToolExample<Input, Output>;
export const angularBinSolidAngleWeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cosmology/angular-bin-solid-angle-weight",
    title: "Angular Bin Solid Angle Weight Tool",
    description:
      "Compute a spherical angular-bin solid angle from explicit cosine-polar bounds and azimuth width.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        azimuthWidthRadians: { type: "number", minimum: 0 },
        lowerCosPolar: { type: "number", minimum: -1, maximum: 1 },
        upperCosPolar: { type: "number", minimum: -1 },
      },
      required: ["azimuthWidthRadians", "lowerCosPolar", "upperCosPolar"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { solidAngleSteradians: { type: "number" } },
      required: ["solidAngleSteradians"],
    },
    ports: {
      inputs: [
        {
          id: "azimuthWidthRadians",
          label: "Azimuth Width Radians",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lowerCosPolar",
          label: "Lower Cos Polar",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upperCosPolar",
          label: "Upper Cos Polar",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "solidAngleSteradians",
          label: "Solid Angle Steradians",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = angularBinSolidAngleWeightTool.execute;
export default angularBinSolidAngleWeightTool;
