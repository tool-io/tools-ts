import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly displacementAmplitudeMeters: number;
  readonly frequencyHertz: number;
};
export type Output = { readonly velocityAmplitudeMetersPerSecond: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    displacementAmplitudeMeters: { type: "number", minimum: 0 },
    frequencyHertz: { type: "number", minimum: 0 },
  },
  required: ["displacementAmplitudeMeters", "frequencyHertz"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { velocityAmplitudeMetersPerSecond: { type: "number" } },
  required: ["velocityAmplitudeMetersPerSecond"],
} as const;
/** Convert explicit sinusoidal particle-displacement amplitude to velocity amplitude using angular frequency. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { displacementAmplitudeMeters, frequencyHertz } = request;
  const compute = (): Output => {
    H.domain(
      displacementAmplitudeMeters >= 0 && frequencyHertz >= 0,
      "displacementAmplitudeMeters",
    );
    return {
      velocityAmplitudeMetersPerSecond:
        2 * Math.PI * frequencyHertz * displacementAmplitudeMeters,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { displacementAmplitudeMeters: 0.001, frequencyHertz: 100 },
  output: { velocityAmplitudeMetersPerSecond: 0.6283185307179586 },
} satisfies ToolExample<Input, Output>;
export const acousticParticleDisplacementVelocityFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["physics"],
        keywords: ["physics"],
      },
      id: "physics/acoustic-particle-displacement-velocity-factor",
      title: "Acoustic Particle Displacement Velocity Factor",
      description:
        "Convert explicit sinusoidal particle-displacement amplitude to velocity amplitude using angular frequency.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          displacementAmplitudeMeters: { type: "number", minimum: 0 },
          frequencyHertz: { type: "number", minimum: 0 },
        },
        required: ["displacementAmplitudeMeters", "frequencyHertz"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { velocityAmplitudeMetersPerSecond: { type: "number" } },
        required: ["velocityAmplitudeMetersPerSecond"],
      },
      ports: {
        inputs: [
          {
            id: "displacementAmplitudeMeters",
            label: "Displacement Amplitude Meters",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "frequencyHertz",
            label: "Frequency Hertz",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "velocityAmplitudeMetersPerSecond",
            label: "Velocity Amplitude Meters Per Second",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = acousticParticleDisplacementVelocityFactorTool.execute;
export default acousticParticleDisplacementVelocityFactorTool;
