import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly outerCapacity: number;
  readonly containers: number;
  readonly innerCapacity: number;
  readonly occupiedInner: number;
};
export type Output = {
  readonly totalCapacity: number;
  readonly remaining: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outerCapacity: { type: "integer", minimum: 0 },
    containers: { type: "integer", minimum: 0 },
    innerCapacity: { type: "integer", minimum: 0 },
    occupiedInner: { type: "integer", minimum: 0 },
  },
  required: ["outerCapacity", "containers", "innerCapacity", "occupiedInner"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalCapacity: { type: "integer" },
    remaining: { type: "integer" },
  },
  required: ["totalCapacity", "remaining"],
} as const;
/** Calculate warehouse slot nested container count budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { outerCapacity, containers, innerCapacity, occupiedInner } = request;
  const compute = (): Output => {
    H.integer(outerCapacity, 0);
    H.integer(containers, 0);
    H.integer(innerCapacity, 0);
    H.integer(
      occupiedInner,
      0,
      Math.min(outerCapacity, containers) * innerCapacity,
    );
    return {
      totalCapacity: Math.min(outerCapacity, containers) * innerCapacity,
      remaining:
        Math.min(outerCapacity, containers) * innerCapacity - occupiedInner,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    outerCapacity: 10,
    containers: 8,
    innerCapacity: 12,
    occupiedInner: 80,
  },
  output: { totalCapacity: 96, remaining: 16 },
} satisfies ToolExample<Input, Output>;
export const warehouseSlotNestedContainerCountBudgetTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "supply-chain/warehouse-slot-nested-container-count-budget",
      title: "Warehouse Slot Nested Container Count Budget Tool",
      description:
        "Calculate warehouse slot nested container count budget from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          outerCapacity: { type: "integer", minimum: 0 },
          containers: { type: "integer", minimum: 0 },
          innerCapacity: { type: "integer", minimum: 0 },
          occupiedInner: { type: "integer", minimum: 0 },
        },
        required: [
          "outerCapacity",
          "containers",
          "innerCapacity",
          "occupiedInner",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          totalCapacity: { type: "integer" },
          remaining: { type: "integer" },
        },
        required: ["totalCapacity", "remaining"],
      },
      ports: {
        inputs: [
          {
            id: "outerCapacity",
            label: "Outer Capacity",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "containers",
            label: "Containers",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "innerCapacity",
            label: "Inner Capacity",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "occupiedInner",
            label: "Occupied Inner",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "totalCapacity",
            label: "Total Capacity",
            valueType: { type: "integer" },
          },
          {
            id: "remaining",
            label: "Remaining",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = warehouseSlotNestedContainerCountBudgetTool.execute;
export default warehouseSlotNestedContainerCountBudgetTool;
