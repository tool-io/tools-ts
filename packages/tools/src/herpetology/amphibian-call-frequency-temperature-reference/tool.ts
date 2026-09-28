import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedHz: number;
  readonly observedTemperature: number;
  readonly referenceTemperature: number;
  readonly slopeHzPerDegree: number;
};
export type Output = {
  readonly temperatureDifference: number;
  readonly correctedHz: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedHz: { type: "number", minimum: 0 },
    observedTemperature: { type: "number" },
    referenceTemperature: { type: "number" },
    slopeHzPerDegree: { type: "number" },
  },
  required: [
    "observedHz",
    "observedTemperature",
    "referenceTemperature",
    "slopeHzPerDegree",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    temperatureDifference: { type: "number" },
    correctedHz: { type: "number" },
  },
  required: ["temperatureDifference", "correctedHz"],
} as const;
/** Linear call-frequency reference-temperature adjustment using an explicit independently calibrated slope. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    observedHz,
    observedTemperature,
    referenceTemperature,
    slopeHzPerDegree,
  } = request;
  const compute = (): Output => {
    H.domain(
      observedHz >= 0 &&
        observedHz +
          slopeHzPerDegree * (referenceTemperature - observedTemperature) >=
          0,
    );
    return {
      temperatureDifference: referenceTemperature - observedTemperature,
      correctedHz:
        observedHz +
        slopeHzPerDegree * (referenceTemperature - observedTemperature),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    observedHz: 1000,
    observedTemperature: 20,
    referenceTemperature: 25,
    slopeHzPerDegree: 10,
  },
  output: { temperatureDifference: 5, correctedHz: 1050 },
} satisfies ToolExample<Input, Output>;
export const amphibianCallFrequencyTemperatureReferenceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "herpetology/amphibian-call-frequency-temperature-reference",
      title: "Amphibian Call Frequency Temperature Reference Tool",
      description:
        "Linear call-frequency reference-temperature adjustment using an explicit independently calibrated slope.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observedHz: { type: "number", minimum: 0 },
          observedTemperature: { type: "number" },
          referenceTemperature: { type: "number" },
          slopeHzPerDegree: { type: "number" },
        },
        required: [
          "observedHz",
          "observedTemperature",
          "referenceTemperature",
          "slopeHzPerDegree",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          temperatureDifference: { type: "number" },
          correctedHz: { type: "number" },
        },
        required: ["temperatureDifference", "correctedHz"],
      },
      ports: {
        inputs: [
          {
            id: "observedHz",
            label: "Observed Hz",
            required: true,
            valueType: { type: "number", unit: "Hz" },
          },
          {
            id: "observedTemperature",
            label: "Observed Temperature",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceTemperature",
            label: "Reference Temperature",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "slopeHzPerDegree",
            label: "Slope Hz Per Degree",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "temperatureDifference",
            label: "Temperature Difference",
            valueType: { type: "number" },
          },
          {
            id: "correctedHz",
            label: "Corrected Hz",
            valueType: { type: "number", unit: "Hz" },
          },
        ],
      },
    },
    calculate,
  });
export const run = amphibianCallFrequencyTemperatureReferenceTool.execute;
export default amphibianCallFrequencyTemperatureReferenceTool;
