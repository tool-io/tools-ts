import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly objectiveBefore: number;
  readonly objectiveAfter: number;
  readonly waterBefore: number;
  readonly waterAfter: number;
};
export type Output = {
  readonly waterIncrement: number;
  readonly marginalObjectivePerWater: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    objectiveBefore: { type: "number" },
    objectiveAfter: { type: "number" },
    waterBefore: { type: "number" },
    waterAfter: { type: "number" },
  },
  required: ["objectiveBefore", "objectiveAfter", "waterBefore", "waterAfter"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    waterIncrement: { type: "number" },
    marginalObjectivePerWater: { type: "number" },
  },
  required: ["waterIncrement", "marginalObjectivePerWater"],
} as const;
/** Finite local objective change per explicit water increment; the caller establishes feasibility and whether a shadow-price interpretation is valid. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { objectiveBefore, objectiveAfter, waterBefore, waterAfter } = request;
  const compute = (): Output => {
    H.domain(waterAfter !== waterBefore);
    return {
      waterIncrement: waterAfter - waterBefore,
      marginalObjectivePerWater:
        (objectiveAfter - objectiveBefore) / (waterAfter - waterBefore),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    objectiveBefore: 1000,
    objectiveAfter: 1200,
    waterBefore: 100,
    waterAfter: 150,
  },
  output: { waterIncrement: 50, marginalObjectivePerWater: 4 },
} satisfies ToolExample<Input, Output>;
export const irrigationWaterShadowPriceTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agricultural-economics/irrigation-water-shadow-price-term",
    title: "Irrigation Water Shadow Price Term Tool",
    description:
      "Finite local objective change per explicit water increment; the caller establishes feasibility and whether a shadow-price interpretation is valid.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        objectiveBefore: { type: "number" },
        objectiveAfter: { type: "number" },
        waterBefore: { type: "number" },
        waterAfter: { type: "number" },
      },
      required: [
        "objectiveBefore",
        "objectiveAfter",
        "waterBefore",
        "waterAfter",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        waterIncrement: { type: "number" },
        marginalObjectivePerWater: { type: "number" },
      },
      required: ["waterIncrement", "marginalObjectivePerWater"],
    },
    ports: {
      inputs: [
        {
          id: "objectiveBefore",
          label: "Objective Before",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "objectiveAfter",
          label: "Objective After",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "waterBefore",
          label: "Water Before",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "waterAfter",
          label: "Water After",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "waterIncrement",
          label: "Water Increment",
          valueType: { type: "number" },
        },
        {
          id: "marginalObjectivePerWater",
          label: "Marginal Objective Per Water",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = irrigationWaterShadowPriceTermTool.execute;
export default irrigationWaterShadowPriceTermTool;
