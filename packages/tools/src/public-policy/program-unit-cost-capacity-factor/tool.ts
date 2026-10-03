import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fixedCost: number;
  readonly variablePerUnit: number;
  readonly capacity: number;
  readonly utilization: number;
};
export type Output = {
  readonly expectedUnits: number;
  readonly totalCost: number;
  readonly unitCost: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fixedCost: { type: "number", minimum: 0 },
    variablePerUnit: { type: "number", minimum: 0 },
    capacity: { type: "integer", minimum: 1 },
    utilization: { type: "number", exclusiveMinimum: 0, maximum: 1 },
  },
  required: ["fixedCost", "variablePerUnit", "capacity", "utilization"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expectedUnits: { type: "number" },
    totalCost: { type: "number" },
    unitCost: { type: "number" },
  },
  required: ["expectedUnits", "totalCost", "unitCost"],
} as const;
/** Calculate program unit cost capacity factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fixedCost, variablePerUnit, capacity, utilization } = request;
  const compute = (): Output => {
    H.domain(
      fixedCost >= 0 &&
        variablePerUnit >= 0 &&
        utilization > 0 &&
        utilization <= 1,
    );
    H.integer(capacity, 1);
    return {
      expectedUnits: capacity * utilization,
      totalCost: fixedCost + variablePerUnit * capacity * utilization,
      unitCost: fixedCost / (capacity * utilization) + variablePerUnit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    fixedCost: 1000,
    variablePerUnit: 10,
    capacity: 100,
    utilization: 0.5,
  },
  output: { expectedUnits: 50, totalCost: 1500, unitCost: 30 },
} satisfies ToolExample<Input, Output>;
export const programUnitCostCapacityFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-policy/program-unit-cost-capacity-factor",
    title: "Program Unit Cost Capacity Factor Tool",
    description:
      "Calculate program unit cost capacity factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fixedCost: { type: "number", minimum: 0 },
        variablePerUnit: { type: "number", minimum: 0 },
        capacity: { type: "integer", minimum: 1 },
        utilization: { type: "number", exclusiveMinimum: 0, maximum: 1 },
      },
      required: ["fixedCost", "variablePerUnit", "capacity", "utilization"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expectedUnits: { type: "number" },
        totalCost: { type: "number" },
        unitCost: { type: "number" },
      },
      required: ["expectedUnits", "totalCost", "unitCost"],
    },
    ports: {
      inputs: [
        {
          id: "fixedCost",
          label: "Fixed Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "variablePerUnit",
          label: "Variable Per Unit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "capacity",
          label: "Capacity",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "utilization",
          label: "Utilization",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "expectedUnits",
          label: "Expected Units",
          valueType: { type: "number" },
        },
        { id: "totalCost", label: "Total Cost", valueType: { type: "number" } },
        { id: "unitCost", label: "Unit Cost", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = programUnitCostCapacityFactorTool.execute;
export default programUnitCostCapacityFactorTool;
