import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coverFraction: number;
  readonly otherCoveredFraction: number;
};
export type Output = { readonly bareFraction: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coverFraction: { type: "number", minimum: 0, maximum: 1 },
    otherCoveredFraction: { type: "number", minimum: 0 },
  },
  required: ["coverFraction", "otherCoveredFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { bareFraction: { type: "number" } },
  required: ["bareFraction"],
} as const;
/** Compute bare-ground fraction from two explicitly disjoint cover fractions with total at most one. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coverFraction, otherCoveredFraction } = request;
  const compute = (): Output => {
    (H.domain(coverFraction >= 0 && coverFraction <= 1, "coverFraction"),
      coverFraction);
    H.domain(
      otherCoveredFraction >= 0 && otherCoveredFraction <= 1 - coverFraction,
      "otherCoveredFraction",
    );
    return { bareFraction: 1 - coverFraction - otherCoveredFraction };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { coverFraction: 0.5, otherCoveredFraction: 0.25 },
  output: { bareFraction: 0.25 },
} satisfies ToolExample<Input, Output>;
export const coverCropBareGroundRemainderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agroecology", "agriculture"],
      keywords: ["agroecology", "agriculture"],
    },
    id: "agroecology/cover-crop-bare-ground-remainder",
    title: "Cover Crop Bare Ground Remainder",
    description:
      "Compute bare-ground fraction from two explicitly disjoint cover fractions with total at most one.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coverFraction: { type: "number", minimum: 0, maximum: 1 },
        otherCoveredFraction: { type: "number", minimum: 0 },
      },
      required: ["coverFraction", "otherCoveredFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { bareFraction: { type: "number" } },
      required: ["bareFraction"],
    },
    ports: {
      inputs: [
        {
          id: "coverFraction",
          label: "Cover Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "otherCoveredFraction",
          label: "Other Covered Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "bareFraction",
          label: "Bare Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = coverCropBareGroundRemainderTool.execute;
export default coverCropBareGroundRemainderTool;
