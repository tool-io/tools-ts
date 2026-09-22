import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly incidentIntensity: number;
  readonly relativeAngleRadians: number;
  readonly leakageFraction: number;
};
export type Output = {
  readonly idealTransmission: number;
  readonly intensity: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    incidentIntensity: { type: "number", minimum: 0 },
    relativeAngleRadians: { type: "number" },
    leakageFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["incidentIntensity", "relativeAngleRadians", "leakageFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    idealTransmission: { type: "number" },
    intensity: { type: "number" },
  },
  required: ["idealTransmission", "intensity"],
} as const;
/** Malus-law angular term with a supplied leakage floor; incident intensity is already polarized. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { incidentIntensity, relativeAngleRadians, leakageFraction } = request;
  const compute = (): Output => {
    H.domain(incidentIntensity >= 0);
    H.probability(leakageFraction);
    return {
      idealTransmission: Math.cos(relativeAngleRadians) ** 2,
      intensity:
        incidentIntensity *
        (leakageFraction +
          (1 - leakageFraction) * Math.cos(relativeAngleRadians) ** 2),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    incidentIntensity: 100,
    relativeAngleRadians: 0,
    leakageFraction: 0.01,
  },
  output: { idealTransmission: 1, intensity: 100 },
} satisfies ToolExample<Input, Output>;
export const artworkPhotographyPolarizerAngleFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "art-conservation/artwork-photography-polarizer-angle-factor",
      title: "Artwork Photography Polarizer Angle Factor Tool",
      description:
        "Malus-law angular term with a supplied leakage floor; incident intensity is already polarized.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          incidentIntensity: { type: "number", minimum: 0 },
          relativeAngleRadians: { type: "number" },
          leakageFraction: { type: "number", minimum: 0, maximum: 1 },
        },
        required: [
          "incidentIntensity",
          "relativeAngleRadians",
          "leakageFraction",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          idealTransmission: { type: "number" },
          intensity: { type: "number" },
        },
        required: ["idealTransmission", "intensity"],
      },
      ports: {
        inputs: [
          {
            id: "incidentIntensity",
            label: "Incident Intensity",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "relativeAngleRadians",
            label: "Relative Angle Radians",
            required: true,
            valueType: { type: "number", unit: "rad" },
          },
          {
            id: "leakageFraction",
            label: "Leakage Fraction",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "idealTransmission",
            label: "Ideal Transmission",
            valueType: { type: "number" },
          },
          {
            id: "intensity",
            label: "Intensity",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = artworkPhotographyPolarizerAngleFactorTool.execute;
export default artworkPhotographyPolarizerAngleFactorTool;
