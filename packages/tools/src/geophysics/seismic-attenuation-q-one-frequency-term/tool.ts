import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialAmplitude: number;
  readonly frequencyHz: number;
  readonly travelSeconds: number;
  readonly qualityFactor: number;
};
export type Output = {
  readonly amplitudeFactor: number;
  readonly finalAmplitude: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialAmplitude: { type: "number" },
    frequencyHz: { type: "number", minimum: 0 },
    travelSeconds: { type: "number", minimum: 0 },
    qualityFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "initialAmplitude",
    "frequencyHz",
    "travelSeconds",
    "qualityFactor",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    amplitudeFactor: { type: "number" },
    finalAmplitude: { type: "number" },
  },
  required: ["amplitudeFactor", "finalAmplitude"],
} as const;
/** Constant-Q amplitude attenuation exp(-pi*f*t/Q), excluding geometric spreading. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initialAmplitude, frequencyHz, travelSeconds, qualityFactor } =
    request;
  const compute = (): Output => {
    H.domain(frequencyHz >= 0 && travelSeconds >= 0);
    H.positive(qualityFactor);
    return {
      amplitudeFactor: Math.exp(
        (-Math.PI * frequencyHz * travelSeconds) / qualityFactor,
      ),
      finalAmplitude:
        initialAmplitude *
        Math.exp((-Math.PI * frequencyHz * travelSeconds) / qualityFactor),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    initialAmplitude: 2,
    frequencyHz: 20,
    travelSeconds: 0.5,
    qualityFactor: 80,
  },
  output: {
    amplitudeFactor: 0.6752319066557773,
    finalAmplitude: 1.3504638133115545,
  },
} satisfies ToolExample<Input, Output>;
export const seismicAttenuationQOneFrequencyTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geophysics/seismic-attenuation-q-one-frequency-term",
      title: "Seismic Attenuation Q One Frequency Term Tool",
      description:
        "Constant-Q amplitude attenuation exp(-pi*f*t/Q), excluding geometric spreading.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          initialAmplitude: { type: "number" },
          frequencyHz: { type: "number", minimum: 0 },
          travelSeconds: { type: "number", minimum: 0 },
          qualityFactor: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "initialAmplitude",
          "frequencyHz",
          "travelSeconds",
          "qualityFactor",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          amplitudeFactor: { type: "number" },
          finalAmplitude: { type: "number" },
        },
        required: ["amplitudeFactor", "finalAmplitude"],
      },
      ports: {
        inputs: [
          {
            id: "initialAmplitude",
            label: "Initial Amplitude",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "frequencyHz",
            label: "Frequency Hz",
            required: true,
            valueType: { type: "number", unit: "Hz" },
          },
          {
            id: "travelSeconds",
            label: "Travel Seconds",
            required: true,
            valueType: { type: "number", unit: "s" },
          },
          {
            id: "qualityFactor",
            label: "Quality Factor",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "amplitudeFactor",
            label: "Amplitude Factor",
            valueType: { type: "number" },
          },
          {
            id: "finalAmplitude",
            label: "Final Amplitude",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = seismicAttenuationQOneFrequencyTermTool.execute;
export default seismicAttenuationQOneFrequencyTermTool;
