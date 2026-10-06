import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wavelength: number;
  readonly pulseRepetitionFrequency: number;
};
export type Output = {
  readonly nyquistSpeed: number;
  readonly lowerInclusive: number;
  readonly upperExclusive: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wavelength: { type: "number", exclusiveMinimum: 0 },
    pulseRepetitionFrequency: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["wavelength", "pulseRepetitionFrequency"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nyquistSpeed: { type: "number" },
    lowerInclusive: { type: "number" },
    upperExclusive: { type: "number" },
  },
  required: ["nyquistSpeed", "lowerInclusive", "upperExclusive"],
} as const;
/** Calculate the single-PRF monostatic Doppler radar unambiguous velocity interval using an explicit half-open convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wavelength, pulseRepetitionFrequency } = request;
  const compute = (): Output => {
    (H.domain(Number.isFinite(wavelength) && wavelength > 0, "wavelength"),
      wavelength);
    (H.domain(
      Number.isFinite(pulseRepetitionFrequency) && pulseRepetitionFrequency > 0,
      "pulseRepetitionFrequency",
    ),
      pulseRepetitionFrequency);
    return {
      nyquistSpeed: (wavelength * pulseRepetitionFrequency) / 4,
      lowerInclusive: (-wavelength * pulseRepetitionFrequency) / 4,
      upperExclusive: (wavelength * pulseRepetitionFrequency) / 4,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { wavelength: 0.1, pulseRepetitionFrequency: 1000 },
  output: { nyquistSpeed: 25, lowerInclusive: -25, upperExclusive: 25 },
} satisfies ToolExample<Input, Output>;
export const radarNyquistVelocityIntervalTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["atmospheric-physics", "atmospheric physics", "physics"],
      keywords: ["atmospheric physics", "physics"],
    },
    id: "atmospheric-physics/radar-nyquist-velocity-interval",
    title: "Radar Nyquist Velocity Interval",
    description:
      "Calculate the single-PRF monostatic Doppler radar unambiguous velocity interval using an explicit half-open convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wavelength: { type: "number", exclusiveMinimum: 0 },
        pulseRepetitionFrequency: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["wavelength", "pulseRepetitionFrequency"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nyquistSpeed: { type: "number" },
        lowerInclusive: { type: "number" },
        upperExclusive: { type: "number" },
      },
      required: ["nyquistSpeed", "lowerInclusive", "upperExclusive"],
    },
    ports: {
      inputs: [
        {
          id: "wavelength",
          label: "Wavelength",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pulseRepetitionFrequency",
          label: "Pulse Repetition Frequency",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "nyquistSpeed",
          label: "Nyquist Speed",
          valueType: { type: "number" },
        },
        {
          id: "lowerInclusive",
          label: "Lower Inclusive",
          valueType: { type: "number" },
        },
        {
          id: "upperExclusive",
          label: "Upper Exclusive",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = radarNyquistVelocityIntervalTool.execute;
export default radarNyquistVelocityIntervalTool;
