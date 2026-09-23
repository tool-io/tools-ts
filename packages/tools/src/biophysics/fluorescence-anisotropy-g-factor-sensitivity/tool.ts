import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly parallelIntensity: number;
  readonly perpendicularIntensity: number;
  readonly gFactor: number;
};
export type Output = {
  readonly anisotropy: number;
  readonly derivative: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parallelIntensity: { type: "number", minimum: 0 },
    perpendicularIntensity: { type: "number", minimum: 0 },
    gFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["parallelIntensity", "perpendicularIntensity", "gFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    anisotropy: { type: "number" },
    derivative: { type: "number" },
  },
  required: ["anisotropy", "derivative"],
} as const;
/** Calculate fluorescence anisotropy g factor sensitivity from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { parallelIntensity, perpendicularIntensity, gFactor } = request;
  const compute = (): Output => {
    H.domain(
      parallelIntensity >= 0 &&
        perpendicularIntensity >= 0 &&
        gFactor > 0 &&
        parallelIntensity + 2 * gFactor * perpendicularIntensity > 0,
    );
    return {
      anisotropy:
        (parallelIntensity - gFactor * perpendicularIntensity) /
        (parallelIntensity + 2 * gFactor * perpendicularIntensity),
      derivative:
        (-3 * parallelIntensity * perpendicularIntensity) /
        (parallelIntensity + 2 * gFactor * perpendicularIntensity) ** 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { parallelIntensity: 100, perpendicularIntensity: 50, gFactor: 1 },
  output: { anisotropy: 0.25, derivative: -0.375 },
} satisfies ToolExample<Input, Output>;
export const fluorescenceAnisotropyGFactorSensitivityTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biophysics/fluorescence-anisotropy-g-factor-sensitivity",
      title: "Fluorescence Anisotropy G Factor Sensitivity Tool",
      description:
        "Calculate fluorescence anisotropy g factor sensitivity from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          parallelIntensity: { type: "number", minimum: 0 },
          perpendicularIntensity: { type: "number", minimum: 0 },
          gFactor: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["parallelIntensity", "perpendicularIntensity", "gFactor"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          anisotropy: { type: "number" },
          derivative: { type: "number" },
        },
        required: ["anisotropy", "derivative"],
      },
      ports: {
        inputs: [
          {
            id: "parallelIntensity",
            label: "Parallel Intensity",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "perpendicularIntensity",
            label: "Perpendicular Intensity",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "gFactor",
            label: "G Factor",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "anisotropy",
            label: "Anisotropy",
            valueType: { type: "number" },
          },
          {
            id: "derivative",
            label: "Derivative",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = fluorescenceAnisotropyGFactorSensitivityTool.execute;
export default fluorescenceAnisotropyGFactorSensitivityTool;
