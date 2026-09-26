import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly concentration: number;
  readonly volumePerDay: number;
  readonly days: number;
  readonly bodyMass: number;
};
export type Output = {
  readonly massPerDay: number;
  readonly totalMass: number;
  readonly massPerBodyMassDay: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    concentration: { type: "number", minimum: 0 },
    volumePerDay: { type: "number", minimum: 0 },
    days: { type: "number", minimum: 0 },
    bodyMass: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["concentration", "volumePerDay", "days", "bodyMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    massPerDay: { type: "number" },
    totalMass: { type: "number" },
    massPerBodyMassDay: { type: "number" },
  },
  required: ["massPerDay", "totalMass", "massPerBodyMassDay"],
} as const;
/** Compute a supplied intake inventory without selecting exposure or risk limits. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { concentration, volumePerDay, days, bodyMass } = request;
  const compute = (): Output => {
    H.domain(concentration >= 0 && volumePerDay >= 0 && days >= 0);
    H.positive(bodyMass);
    return {
      massPerDay: concentration * volumePerDay,
      totalMass: concentration * volumePerDay * days,
      massPerBodyMassDay: (concentration * volumePerDay) / bodyMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { concentration: 0.01, volumePerDay: 2, days: 7, bodyMass: 70 },
  output: {
    massPerDay: 0.02,
    totalMass: 0.14,
    massPerBodyMassDay: 0.00028571428571428574,
  },
} satisfies ToolExample<Input, Output>;
export const drinkingWaterConcentrationIntakeVolumeTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "environmental-health/drinking-water-concentration-intake-volume-term",
      title: "Drinking Water Concentration Intake Volume Term Tool",
      description:
        "Compute a supplied intake inventory without selecting exposure or risk limits.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          concentration: { type: "number", minimum: 0 },
          volumePerDay: { type: "number", minimum: 0 },
          days: { type: "number", minimum: 0 },
          bodyMass: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["concentration", "volumePerDay", "days", "bodyMass"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          massPerDay: { type: "number" },
          totalMass: { type: "number" },
          massPerBodyMassDay: { type: "number" },
        },
        required: ["massPerDay", "totalMass", "massPerBodyMassDay"],
      },
      ports: {
        inputs: [
          {
            id: "concentration",
            label: "Concentration",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "volumePerDay",
            label: "Volume Per Day",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "days",
            label: "Days",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "bodyMass",
            label: "Body Mass",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "massPerDay",
            label: "Mass Per Day",
            valueType: { type: "number" },
          },
          {
            id: "totalMass",
            label: "Total Mass",
            valueType: { type: "number" },
          },
          {
            id: "massPerBodyMassDay",
            label: "Mass Per Body Mass Day",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = drinkingWaterConcentrationIntakeVolumeTermTool.execute;
export default drinkingWaterConcentrationIntakeVolumeTermTool;
