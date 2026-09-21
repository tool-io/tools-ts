import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly gapPixels: number;
  readonly opaquePixels: number;
  readonly excludedPixels: number;
};
export type Output = {
  readonly eligible: number;
  readonly gapFraction: number;
  readonly excludedShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gapPixels: { type: "integer", minimum: 0 },
    opaquePixels: { type: "integer", minimum: 0 },
    excludedPixels: { type: "integer", minimum: 0 },
  },
  required: ["gapPixels", "opaquePixels", "excludedPixels"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligible: { type: "integer" },
    gapFraction: { type: "number" },
    excludedShare: { type: "number" },
  },
  required: ["eligible", "gapFraction", "excludedShare"],
} as const;
/** Calculate shelterbelt optical porosity gap fraction from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { gapPixels, opaquePixels, excludedPixels } = request;
  const compute = (): Output => {
    H.integer(gapPixels, 0);
    H.integer(opaquePixels, 0);
    H.integer(excludedPixels, 0);
    H.domain(gapPixels + opaquePixels > 0);
    return {
      eligible: gapPixels + opaquePixels,
      gapFraction: gapPixels / (gapPixels + opaquePixels),
      excludedShare:
        excludedPixels / (gapPixels + opaquePixels + excludedPixels),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { gapPixels: 30, opaquePixels: 70, excludedPixels: 10 },
  output: {
    eligible: 100,
    gapFraction: 0.3,
    excludedShare: 0.09090909090909091,
  },
} satisfies ToolExample<Input, Output>;
export const shelterbeltOpticalPorosityGapFractionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "agroforestry/shelterbelt-optical-porosity-gap-fraction",
      title: "Shelterbelt Optical Porosity Gap Fraction Tool",
      description:
        "Calculate shelterbelt optical porosity gap fraction from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          gapPixels: { type: "integer", minimum: 0 },
          opaquePixels: { type: "integer", minimum: 0 },
          excludedPixels: { type: "integer", minimum: 0 },
        },
        required: ["gapPixels", "opaquePixels", "excludedPixels"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          eligible: { type: "integer" },
          gapFraction: { type: "number" },
          excludedShare: { type: "number" },
        },
        required: ["eligible", "gapFraction", "excludedShare"],
      },
      ports: {
        inputs: [
          {
            id: "gapPixels",
            label: "Gap Pixels",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "opaquePixels",
            label: "Opaque Pixels",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "excludedPixels",
            label: "Excluded Pixels",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          { id: "eligible", label: "Eligible", valueType: { type: "integer" } },
          {
            id: "gapFraction",
            label: "Gap Fraction",
            valueType: { type: "number", unit: "1" },
          },
          {
            id: "excludedShare",
            label: "Excluded Share",
            valueType: { type: "number", unit: "1" },
          },
        ],
      },
    },
    calculate,
  });
export const run = shelterbeltOpticalPorosityGapFractionTool.execute;
export default shelterbeltOpticalPorosityGapFractionTool;
