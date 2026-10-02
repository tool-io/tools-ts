import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly massKg: number;
  readonly specificHeatJPerKgK: number;
  readonly temperatureChangeK: number;
  readonly durationSeconds: number;
};
export type Output = {
  readonly storedHeatJ: number;
  readonly meanStoragePowerW: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    massKg: { type: "number", minimum: 0 },
    specificHeatJPerKgK: { type: "number", exclusiveMinimum: 0 },
    temperatureChangeK: { type: "number" },
    durationSeconds: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "massKg",
    "specificHeatJPerKgK",
    "temperatureChangeK",
    "durationSeconds",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    storedHeatJ: { type: "number" },
    meanStoragePowerW: { type: "number" },
  },
  required: ["storedHeatJ", "meanStoragePowerW"],
} as const;
/** Uniform effective-specific-heat storage model with a supplied coefficient, excluding compartment temperature variation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { massKg, specificHeatJPerKgK, temperatureChangeK, durationSeconds } =
    request;
  const compute = (): Output => {
    H.domain(massKg >= 0);
    H.positive(specificHeatJPerKgK);
    H.positive(durationSeconds);
    return {
      storedHeatJ: massKg * specificHeatJPerKgK * temperatureChangeK,
      meanStoragePowerW:
        (massKg * specificHeatJPerKgK * temperatureChangeK) / durationSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    massKg: 70,
    specificHeatJPerKgK: 3500,
    temperatureChangeK: 0.2,
    durationSeconds: 600,
  },
  output: { storedHeatJ: 49000, meanStoragePowerW: 81.66666666666667 },
} satisfies ToolExample<Input, Output>;
export const bodyHeatStorageSpecificHeatFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physiology/body-heat-storage-specific-heat-factor",
    title: "Body Heat Storage Specific Heat Factor Tool",
    description:
      "Uniform effective-specific-heat storage model with a supplied coefficient, excluding compartment temperature variation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        massKg: { type: "number", minimum: 0 },
        specificHeatJPerKgK: { type: "number", exclusiveMinimum: 0 },
        temperatureChangeK: { type: "number" },
        durationSeconds: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "massKg",
        "specificHeatJPerKgK",
        "temperatureChangeK",
        "durationSeconds",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        storedHeatJ: { type: "number" },
        meanStoragePowerW: { type: "number" },
      },
      required: ["storedHeatJ", "meanStoragePowerW"],
    },
    ports: {
      inputs: [
        {
          id: "massKg",
          label: "Mass Kg",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "specificHeatJPerKgK",
          label: "Specific Heat JPer Kg K",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "temperatureChangeK",
          label: "Temperature Change K",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "durationSeconds",
          label: "Duration Seconds",
          required: true,
          valueType: { type: "number", unit: "s" },
        },
      ],
      outputs: [
        {
          id: "storedHeatJ",
          label: "Stored Heat J",
          valueType: { type: "number" },
        },
        {
          id: "meanStoragePowerW",
          label: "Mean Storage Power W",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = bodyHeatStorageSpecificHeatFactorTool.execute;
export default bodyHeatStorageSpecificHeatFactorTool;
