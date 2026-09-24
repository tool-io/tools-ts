import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly area: number;
  readonly solidAngle: number;
  readonly cosine: number;
  readonly refractiveIndex: number;
};
export type Output = { readonly etendue: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    area: { type: "number", minimum: 0 },
    solidAngle: { type: "number", minimum: 0 },
    cosine: { type: "number", minimum: 0, maximum: 1 },
    refractiveIndex: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["area", "solidAngle", "cosine", "refractiveIndex"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { etendue: { type: "number" } },
  required: ["etendue"],
} as const;
/** Return the n squared A Omega cos(theta) differential-aperture etendue approximation in consistent area units. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { area, solidAngle, cosine, refractiveIndex } = input;
  const compute = (): Output => {
    H.domain(area >= 0 && solidAngle >= 0 && cosine >= 0 && cosine <= 1);
    H.positive(refractiveIndex);
    return { etendue: area * solidAngle * cosine * refractiveIndex ** 2 };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { area: 2, solidAngle: 3, cosine: 0.5, refractiveIndex: 2 },
  output: { etendue: 12 },
} satisfies ToolExample<Input, Output>;
export const radiometricEtendueAreaSolidAngleFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "convert/radiometric-etendue-area-solid-angle-factor",
      title: "Radiometric Etendue Area Solid Angle Factor Tool",
      description:
        "Return the n squared A Omega cos(theta) differential-aperture etendue approximation in consistent area units.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          area: { type: "number", minimum: 0 },
          solidAngle: { type: "number", minimum: 0 },
          cosine: { type: "number", minimum: 0, maximum: 1 },
          refractiveIndex: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["area", "solidAngle", "cosine", "refractiveIndex"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { etendue: { type: "number" } },
        required: ["etendue"],
      },
      ports: {
        inputs: [
          {
            id: "area",
            label: "Area",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "solidAngle",
            label: "Solid Angle",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "cosine",
            label: "Cosine",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "refractiveIndex",
            label: "Refractive Index",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "etendue", label: "Etendue", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = radiometricEtendueAreaSolidAngleFactorTool.execute;
export default radiometricEtendueAreaSolidAngleFactorTool;
