import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly temperature: number;
  readonly lowerThreshold: number;
  readonly upperCap: number;
  readonly hours: number;
};
export type Output = {
  readonly effectiveTemperature: number;
  readonly degreeHours: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    temperature: { type: "number" },
    lowerThreshold: { type: "number" },
    upperCap: { type: "number" },
    hours: { type: "number", minimum: 0 },
  },
  required: ["temperature", "lowerThreshold", "upperCap", "hours"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    effectiveTemperature: { type: "number" },
    degreeHours: { type: "number" },
  },
  required: ["effectiveTemperature", "degreeHours"],
} as const;
/** Constant-temperature horizontal upper-cutoff degree-hours with caller-specified thresholds, not an inferred species development model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { temperature, lowerThreshold, upperCap, hours } = request;
  const compute = (): Output => {
    H.domain(upperCap > lowerThreshold && hours >= 0);
    return {
      effectiveTemperature: Math.max(
        0,
        Math.min(temperature, upperCap) - lowerThreshold,
      ),
      degreeHours:
        Math.max(0, Math.min(temperature, upperCap) - lowerThreshold) * hours,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { temperature: 25, lowerThreshold: 10, upperCap: 30, hours: 4 },
  output: { effectiveTemperature: 15, degreeHours: 60 },
} satisfies ToolExample<Input, Output>;
export const insectDevelopmentDegreehourOneIntervalTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "entomology/insect-development-degreehour-one-interval",
      title: "Insect Development Degreehour One Interval Tool",
      description:
        "Constant-temperature horizontal upper-cutoff degree-hours with caller-specified thresholds, not an inferred species development model.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          temperature: { type: "number" },
          lowerThreshold: { type: "number" },
          upperCap: { type: "number" },
          hours: { type: "number", minimum: 0 },
        },
        required: ["temperature", "lowerThreshold", "upperCap", "hours"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          effectiveTemperature: { type: "number" },
          degreeHours: { type: "number" },
        },
        required: ["effectiveTemperature", "degreeHours"],
      },
      ports: {
        inputs: [
          {
            id: "temperature",
            label: "Temperature",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "lowerThreshold",
            label: "Lower Threshold",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "upperCap",
            label: "Upper Cap",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "hours",
            label: "Hours",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "effectiveTemperature",
            label: "Effective Temperature",
            valueType: { type: "number" },
          },
          {
            id: "degreeHours",
            label: "Degree Hours",
            valueType: { type: "number", unit: "h" },
          },
        ],
      },
    },
    calculate,
  });
export const run = insectDevelopmentDegreehourOneIntervalTool.execute;
export default insectDevelopmentDegreehourOneIntervalTool;
