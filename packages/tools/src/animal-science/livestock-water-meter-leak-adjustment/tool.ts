import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingMeter: number;
  readonly closingMeter: number;
  readonly estimatedLeak: number;
  readonly animals: number;
  readonly days: number;
};
export type Output = {
  readonly meteredUse: number;
  readonly adjustedUse: number;
  readonly perAnimalDay: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingMeter: { type: "number" },
    closingMeter: { type: "number" },
    estimatedLeak: { type: "number", minimum: 0 },
    animals: { type: "integer", minimum: 1 },
    days: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "openingMeter",
    "closingMeter",
    "estimatedLeak",
    "animals",
    "days",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    meteredUse: { type: "number" },
    adjustedUse: { type: "number" },
    perAnimalDay: { type: "number" },
  },
  required: ["meteredUse", "adjustedUse", "perAnimalDay"],
} as const;
/** Calculate livestock water meter leak adjustment from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openingMeter, closingMeter, estimatedLeak, animals, days } = request;
  const compute = (): Output => {
    H.domain(
      closingMeter >= openingMeter &&
        estimatedLeak >= 0 &&
        estimatedLeak <= closingMeter - openingMeter,
    );
    H.integer(animals, 1);
    H.positive(days);
    return {
      meteredUse: closingMeter - openingMeter,
      adjustedUse: closingMeter - openingMeter - estimatedLeak,
      perAnimalDay:
        (closingMeter - openingMeter - estimatedLeak) / (animals * days),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    openingMeter: 100,
    closingMeter: 400,
    estimatedLeak: 50,
    animals: 10,
    days: 5,
  },
  output: { meteredUse: 300, adjustedUse: 250, perAnimalDay: 5 },
} satisfies ToolExample<Input, Output>;
export const livestockWaterMeterLeakAdjustmentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "animal-science/livestock-water-meter-leak-adjustment",
    title: "Livestock Water Meter Leak Adjustment Tool",
    description:
      "Calculate livestock water meter leak adjustment from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openingMeter: { type: "number" },
        closingMeter: { type: "number" },
        estimatedLeak: { type: "number", minimum: 0 },
        animals: { type: "integer", minimum: 1 },
        days: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "openingMeter",
        "closingMeter",
        "estimatedLeak",
        "animals",
        "days",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        meteredUse: { type: "number" },
        adjustedUse: { type: "number" },
        perAnimalDay: { type: "number" },
      },
      required: ["meteredUse", "adjustedUse", "perAnimalDay"],
    },
    ports: {
      inputs: [
        {
          id: "openingMeter",
          label: "Opening Meter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "closingMeter",
          label: "Closing Meter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "estimatedLeak",
          label: "Estimated Leak",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "animals",
          label: "Animals",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "days",
          label: "Days",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "meteredUse",
          label: "Metered Use",
          valueType: { type: "number" },
        },
        {
          id: "adjustedUse",
          label: "Adjusted Use",
          valueType: { type: "number" },
        },
        {
          id: "perAnimalDay",
          label: "Per Animal Day",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = livestockWaterMeterLeakAdjustmentTool.execute;
export default livestockWaterMeterLeakAdjustmentTool;
