import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly capacity: number;
  readonly recordedOccupancy: number;
};
export type Output = {
  readonly remainingSpaces: number;
  readonly overCapacity: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    capacity: { type: "integer", minimum: 0 },
    recordedOccupancy: { type: "integer", minimum: 0 },
  },
  required: ["capacity", "recordedOccupancy"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingSpaces: { type: "integer" },
    overCapacity: { type: "boolean" },
  },
  required: ["remainingSpaces", "overCapacity"],
} as const;
/** Compare explicit cabinet-pocket occupancy and capacity counts without determining medication storage suitability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { capacity, recordedOccupancy } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(capacity) &&
        capacity >= 0 &&
        capacity <= Number.MAX_SAFE_INTEGER,
      "capacity",
    ),
      capacity);
    (H.domain(
      Number.isSafeInteger(recordedOccupancy) &&
        recordedOccupancy >= 0 &&
        recordedOccupancy <= Number.MAX_SAFE_INTEGER,
      "recordedOccupancy",
    ),
      recordedOccupancy);
    return {
      remainingSpaces: capacity - recordedOccupancy,
      overCapacity: recordedOccupancy > capacity,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { capacity: 24, recordedOccupancy: 18 },
  output: { remainingSpaces: 6, overCapacity: false },
} satisfies ToolExample<Input, Output>;
export const cabinetPocketCapacityMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["hospital-pharmacy", "hospital pharmacy", "pharmacy"],
      keywords: ["hospital pharmacy", "pharmacy"],
    },
    id: "hospital-pharmacy/cabinet-pocket-capacity-margin",
    title: "Cabinet Pocket Capacity Margin",
    description:
      "Compare explicit cabinet-pocket occupancy and capacity counts without determining medication storage suitability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        capacity: { type: "integer", minimum: 0 },
        recordedOccupancy: { type: "integer", minimum: 0 },
      },
      required: ["capacity", "recordedOccupancy"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remainingSpaces: { type: "integer" },
        overCapacity: { type: "boolean" },
      },
      required: ["remainingSpaces", "overCapacity"],
    },
    ports: {
      inputs: [
        {
          id: "capacity",
          label: "Capacity",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "recordedOccupancy",
          label: "Recorded Occupancy",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "remainingSpaces",
          label: "Remaining Spaces",
          valueType: { type: "integer" },
        },
        {
          id: "overCapacity",
          label: "Over Capacity",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = cabinetPocketCapacityMarginTool.execute;
export default cabinetPocketCapacityMarginTool;
