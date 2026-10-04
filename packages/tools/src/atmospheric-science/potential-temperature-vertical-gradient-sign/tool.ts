import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lowerThetaKelvin: number;
  readonly upperThetaKelvin: number;
  readonly lowerHeightMeters: number;
  readonly upperHeightMeters: number;
};
export type Output = {
  readonly gradientKelvinPerMeter: number;
  readonly sign: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerThetaKelvin: { type: "number", exclusiveMinimum: 0 },
    upperThetaKelvin: { type: "number", exclusiveMinimum: 0 },
    lowerHeightMeters: { type: "number" },
    upperHeightMeters: { type: "number" },
  },
  required: [
    "lowerThetaKelvin",
    "upperThetaKelvin",
    "lowerHeightMeters",
    "upperHeightMeters",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gradientKelvinPerMeter: { type: "number" },
    sign: { type: "string", maxLength: 8192 },
  },
  required: ["gradientKelvinPerMeter", "sign"],
} as const;
/** Describe the signed potential-temperature gradient between two increasing heights without applying moisture-dependent stability criteria. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    lowerThetaKelvin,
    upperThetaKelvin,
    lowerHeightMeters,
    upperHeightMeters,
  } = request;
  const compute = (): Output => {
    (H.domain(lowerThetaKelvin > 0, "lowerThetaKelvin"), lowerThetaKelvin);
    (H.domain(upperThetaKelvin > 0, "upperThetaKelvin"), upperThetaKelvin);
    H.domain(upperHeightMeters > lowerHeightMeters, "upperHeightMeters");
    return (() => {
      const gradientKelvinPerMeter =
        (upperThetaKelvin - lowerThetaKelvin) /
        (upperHeightMeters - lowerHeightMeters);
      return {
        gradientKelvinPerMeter,
        sign:
          gradientKelvinPerMeter > 0
            ? "positive"
            : gradientKelvinPerMeter < 0
              ? "negative"
              : "zero",
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    lowerThetaKelvin: 290,
    upperThetaKelvin: 295,
    lowerHeightMeters: 0,
    upperHeightMeters: 1000,
  },
  output: { gradientKelvinPerMeter: 0.005, sign: "positive" },
} satisfies ToolExample<Input, Output>;
export const potentialTemperatureVerticalGradientSignTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "atmospheric-science/potential-temperature-vertical-gradient-sign",
      title: "Potential Temperature Vertical Gradient Sign Tool",
      description:
        "Describe the signed potential-temperature gradient between two increasing heights without applying moisture-dependent stability criteria.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          lowerThetaKelvin: { type: "number", exclusiveMinimum: 0 },
          upperThetaKelvin: { type: "number", exclusiveMinimum: 0 },
          lowerHeightMeters: { type: "number" },
          upperHeightMeters: { type: "number" },
        },
        required: [
          "lowerThetaKelvin",
          "upperThetaKelvin",
          "lowerHeightMeters",
          "upperHeightMeters",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          gradientKelvinPerMeter: { type: "number" },
          sign: { type: "string", maxLength: 8192 },
        },
        required: ["gradientKelvinPerMeter", "sign"],
      },
      ports: {
        inputs: [
          {
            id: "lowerThetaKelvin",
            label: "Lower Theta Kelvin",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "upperThetaKelvin",
            label: "Upper Theta Kelvin",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "lowerHeightMeters",
            label: "Lower Height Meters",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "upperHeightMeters",
            label: "Upper Height Meters",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "gradientKelvinPerMeter",
            label: "Gradient Kelvin Per Meter",
            valueType: { type: "number" },
          },
          { id: "sign", label: "Sign", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = potentialTemperatureVerticalGradientSignTool.execute;
export default potentialTemperatureVerticalGradientSignTool;
