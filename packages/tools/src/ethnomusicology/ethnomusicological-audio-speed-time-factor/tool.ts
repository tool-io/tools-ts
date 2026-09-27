import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceSeconds: number;
  readonly speedFactor: number;
  readonly sourceFrequency: number;
  readonly preservePitch: boolean;
};
export type Output = {
  readonly outputSeconds: number;
  readonly outputFrequency: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceSeconds: { type: "number", minimum: 0 },
    speedFactor: { type: "number", exclusiveMinimum: 0 },
    sourceFrequency: { type: "number", exclusiveMinimum: 0 },
    preservePitch: { type: "boolean" },
  },
  required: [
    "sourceSeconds",
    "speedFactor",
    "sourceFrequency",
    "preservePitch",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outputSeconds: { type: "number" },
    outputFrequency: { type: "number" },
  },
  required: ["outputSeconds", "outputFrequency"],
} as const;
/** Ideal duration/pitch relationship under coupled resampling or a declared pitch-preserving transform; no audio is processed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceSeconds, speedFactor, sourceFrequency, preservePitch } =
    request;
  const compute = (): Output => {
    H.domain(sourceSeconds >= 0);
    H.positive(speedFactor);
    H.positive(sourceFrequency);
    return {
      outputSeconds: sourceSeconds / speedFactor,
      outputFrequency: preservePitch
        ? sourceFrequency
        : sourceFrequency * speedFactor,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sourceSeconds: 120,
    speedFactor: 0.8,
    sourceFrequency: 440,
    preservePitch: false,
  },
  output: { outputSeconds: 150, outputFrequency: 352 },
} satisfies ToolExample<Input, Output>;
export const ethnomusicologicalAudioSpeedTimeFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "ethnomusicology/ethnomusicological-audio-speed-time-factor",
      title: "Ethnomusicological Audio Speed Time Factor Tool",
      description:
        "Ideal duration/pitch relationship under coupled resampling or a declared pitch-preserving transform; no audio is processed.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sourceSeconds: { type: "number", minimum: 0 },
          speedFactor: { type: "number", exclusiveMinimum: 0 },
          sourceFrequency: { type: "number", exclusiveMinimum: 0 },
          preservePitch: { type: "boolean" },
        },
        required: [
          "sourceSeconds",
          "speedFactor",
          "sourceFrequency",
          "preservePitch",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          outputSeconds: { type: "number" },
          outputFrequency: { type: "number" },
        },
        required: ["outputSeconds", "outputFrequency"],
      },
      ports: {
        inputs: [
          {
            id: "sourceSeconds",
            label: "Source Seconds",
            required: true,
            valueType: { type: "number", unit: "s" },
          },
          {
            id: "speedFactor",
            label: "Speed Factor",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "sourceFrequency",
            label: "Source Frequency",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "preservePitch",
            label: "Preserve Pitch",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "outputSeconds",
            label: "Output Seconds",
            valueType: { type: "number", unit: "s" },
          },
          {
            id: "outputFrequency",
            label: "Output Frequency",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = ethnomusicologicalAudioSpeedTimeFactorTool.execute;
export default ethnomusicologicalAudioSpeedTimeFactorTool;
