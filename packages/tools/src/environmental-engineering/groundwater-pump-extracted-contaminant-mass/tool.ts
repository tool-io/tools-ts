import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly flow: number;
  readonly duration: number;
  readonly concentration: number;
  readonly capturedFraction: number;
};
export type Output = {
  readonly pumpedVolume: number;
  readonly extractedMass: number;
  readonly capturedMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    flow: { type: "number", minimum: 0 },
    duration: { type: "number", minimum: 0 },
    concentration: { type: "number", minimum: 0 },
    capturedFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["flow", "duration", "concentration", "capturedFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pumpedVolume: { type: "number" },
    extractedMass: { type: "number" },
    capturedMass: { type: "number" },
  },
  required: ["pumpedVolume", "extractedMass", "capturedMass"],
} as const;
/** Constant-flow and constant-concentration extraction in caller-aligned mass/volume/time units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { flow, duration, concentration, capturedFraction } = request;
  const compute = (): Output => {
    H.domain(flow >= 0 && duration >= 0 && concentration >= 0);
    H.probability(capturedFraction);
    return {
      pumpedVolume: flow * duration,
      extractedMass: flow * duration * concentration,
      capturedMass: flow * duration * concentration * capturedFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { flow: 5, duration: 10, concentration: 2, capturedFraction: 0.8 },
  output: { pumpedVolume: 50, extractedMass: 100, capturedMass: 80 },
} satisfies ToolExample<Input, Output>;
export const groundwaterPumpExtractedContaminantMassTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "environmental-engineering/groundwater-pump-extracted-contaminant-mass",
      title: "Groundwater Pump Extracted Contaminant Mass Tool",
      description:
        "Constant-flow and constant-concentration extraction in caller-aligned mass/volume/time units.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          flow: { type: "number", minimum: 0 },
          duration: { type: "number", minimum: 0 },
          concentration: { type: "number", minimum: 0 },
          capturedFraction: { type: "number", minimum: 0, maximum: 1 },
        },
        required: ["flow", "duration", "concentration", "capturedFraction"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          pumpedVolume: { type: "number" },
          extractedMass: { type: "number" },
          capturedMass: { type: "number" },
        },
        required: ["pumpedVolume", "extractedMass", "capturedMass"],
      },
      ports: {
        inputs: [
          {
            id: "flow",
            label: "Flow",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "duration",
            label: "Duration",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "concentration",
            label: "Concentration",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "capturedFraction",
            label: "Captured Fraction",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "pumpedVolume",
            label: "Pumped Volume",
            valueType: { type: "number" },
          },
          {
            id: "extractedMass",
            label: "Extracted Mass",
            valueType: { type: "number" },
          },
          {
            id: "capturedMass",
            label: "Captured Mass",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = groundwaterPumpExtractedContaminantMassTool.execute;
export default groundwaterPumpExtractedContaminantMassTool;
