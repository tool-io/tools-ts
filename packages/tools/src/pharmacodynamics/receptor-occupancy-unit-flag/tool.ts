import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly suppliedOccupancy: number;
  readonly valueIsPercent: boolean;
  readonly totalReceptors: number;
};
export type Output = {
  readonly fraction: number;
  readonly occupiedEquivalent: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    suppliedOccupancy: { type: "number", minimum: 0 },
    valueIsPercent: { type: "boolean" },
    totalReceptors: { type: "number", minimum: 0 },
  },
  required: ["suppliedOccupancy", "valueIsPercent", "totalReceptors"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fraction: { type: "number" },
    occupiedEquivalent: { type: "number" },
  },
  required: ["fraction", "occupiedEquivalent"],
} as const;
/** Convert a supplied occupancy value between percent/fraction notation without a receptor binding or dose model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { suppliedOccupancy, valueIsPercent, totalReceptors } = request;
  const compute = (): Output => {
    H.domain(
      suppliedOccupancy >= 0 &&
        suppliedOccupancy <= (valueIsPercent ? 100 : 1) &&
        totalReceptors >= 0,
    );
    return {
      fraction: valueIsPercent ? suppliedOccupancy / 100 : suppliedOccupancy,
      occupiedEquivalent:
        (valueIsPercent ? suppliedOccupancy / 100 : suppliedOccupancy) *
        totalReceptors,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { suppliedOccupancy: 25, valueIsPercent: true, totalReceptors: 200 },
  output: { fraction: 0.25, occupiedEquivalent: 50 },
} satisfies ToolExample<Input, Output>;
export const receptorOccupancyUnitFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacodynamics/receptor-occupancy-unit-flag",
    title: "Receptor Occupancy Unit Flag Tool",
    description:
      "Convert a supplied occupancy value between percent/fraction notation without a receptor binding or dose model.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        suppliedOccupancy: { type: "number", minimum: 0 },
        valueIsPercent: { type: "boolean" },
        totalReceptors: { type: "number", minimum: 0 },
      },
      required: ["suppliedOccupancy", "valueIsPercent", "totalReceptors"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fraction: { type: "number" },
        occupiedEquivalent: { type: "number" },
      },
      required: ["fraction", "occupiedEquivalent"],
    },
    ports: {
      inputs: [
        {
          id: "suppliedOccupancy",
          label: "Supplied Occupancy",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "valueIsPercent",
          label: "Value Is Percent",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "totalReceptors",
          label: "Total Receptors",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        {
          id: "occupiedEquivalent",
          label: "Occupied Equivalent",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = receptorOccupancyUnitFlagTool.execute;
export default receptorOccupancyUnitFlagTool;
