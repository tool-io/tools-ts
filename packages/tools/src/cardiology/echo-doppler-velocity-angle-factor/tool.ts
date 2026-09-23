import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredProjection: number;
  readonly beamAngleRadians: number;
  readonly angleUncertaintyRadians: number;
};
export type Output = {
  readonly correctedVelocity: number;
  readonly cosineFactor: number;
  readonly localAngleSensitivity: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredProjection: { type: "number" },
    beamAngleRadians: { type: "number" },
    angleUncertaintyRadians: { type: "number", minimum: 0 },
  },
  required: [
    "measuredProjection",
    "beamAngleRadians",
    "angleUncertaintyRadians",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correctedVelocity: { type: "number" },
    cosineFactor: { type: "number" },
    localAngleSensitivity: { type: "number" },
  },
  required: ["correctedVelocity", "cosineFactor", "localAngleSensitivity"],
} as const;
/** Projection cosine correction and first-order signed angle perturbation from explicit angles, without Doppler acquisition or clinical flow inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredProjection, beamAngleRadians, angleUncertaintyRadians } =
    request;
  const compute = (): Output => {
    H.domain(
      beamAngleRadians > -Math.PI / 2 &&
        beamAngleRadians < Math.PI / 2 &&
        angleUncertaintyRadians >= 0,
    );
    return {
      correctedVelocity: measuredProjection / Math.cos(beamAngleRadians),
      cosineFactor: 1 / Math.cos(beamAngleRadians),
      localAngleSensitivity:
        (measuredProjection *
          Math.sin(beamAngleRadians) *
          angleUncertaintyRadians) /
        Math.cos(beamAngleRadians) ** 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    measuredProjection: 1,
    beamAngleRadians: 1.0471975511965976,
    angleUncertaintyRadians: 0,
  },
  output: {
    correctedVelocity: 1.9999999999999996,
    cosineFactor: 1.9999999999999996,
    localAngleSensitivity: 0,
  },
} satisfies ToolExample<Input, Output>;
export const echoDopplerVelocityAngleFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cardiology/echo-doppler-velocity-angle-factor",
    title: "Echo Doppler Velocity Angle Factor Tool",
    description:
      "Projection cosine correction and first-order signed angle perturbation from explicit angles, without Doppler acquisition or clinical flow inference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredProjection: { type: "number" },
        beamAngleRadians: { type: "number" },
        angleUncertaintyRadians: { type: "number", minimum: 0 },
      },
      required: [
        "measuredProjection",
        "beamAngleRadians",
        "angleUncertaintyRadians",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        correctedVelocity: { type: "number" },
        cosineFactor: { type: "number" },
        localAngleSensitivity: { type: "number" },
      },
      required: ["correctedVelocity", "cosineFactor", "localAngleSensitivity"],
    },
    ports: {
      inputs: [
        {
          id: "measuredProjection",
          label: "Measured Projection",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "beamAngleRadians",
          label: "Beam Angle Radians",
          required: true,
          valueType: { type: "number", unit: "rad" },
        },
        {
          id: "angleUncertaintyRadians",
          label: "Angle Uncertainty Radians",
          required: true,
          valueType: { type: "number", unit: "rad" },
        },
      ],
      outputs: [
        {
          id: "correctedVelocity",
          label: "Corrected Velocity",
          valueType: { type: "number" },
        },
        {
          id: "cosineFactor",
          label: "Cosine Factor",
          valueType: { type: "number" },
        },
        {
          id: "localAngleSensitivity",
          label: "Local Angle Sensitivity",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = echoDopplerVelocityAngleFactorTool.execute;
export default echoDopplerVelocityAngleFactorTool;
