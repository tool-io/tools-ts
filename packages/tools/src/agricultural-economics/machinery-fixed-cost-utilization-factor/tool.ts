import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly annualFixedCost: number;
  readonly plannedHours: number;
  readonly actualHours: number;
};
export type Output = {
  readonly plannedPerHour: number;
  readonly actualPerHour: number;
  readonly utilizationFactor: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    annualFixedCost: { type: "number", minimum: 0 },
    plannedHours: { type: "number", exclusiveMinimum: 0 },
    actualHours: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["annualFixedCost", "plannedHours", "actualHours"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    plannedPerHour: { type: "number" },
    actualPerHour: { type: "number" },
    utilizationFactor: { type: "number" },
  },
  required: ["plannedPerHour", "actualPerHour", "utilizationFactor"],
} as const;
/** Calculate machinery fixed cost utilization factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { annualFixedCost, plannedHours, actualHours } = request;
  const compute = (): Output => {
    H.domain(annualFixedCost >= 0);
    H.positive(plannedHours);
    H.positive(actualHours);
    return {
      plannedPerHour: annualFixedCost / plannedHours,
      actualPerHour: annualFixedCost / actualHours,
      utilizationFactor: actualHours / plannedHours,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { annualFixedCost: 10000, plannedHours: 1000, actualHours: 800 },
  output: { plannedPerHour: 10, actualPerHour: 12.5, utilizationFactor: 0.8 },
} satisfies ToolExample<Input, Output>;
export const machineryFixedCostUtilizationFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "agricultural-economics/machinery-fixed-cost-utilization-factor",
      title: "Machinery Fixed Cost Utilization Factor Tool",
      description:
        "Calculate machinery fixed cost utilization factor from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          annualFixedCost: { type: "number", minimum: 0 },
          plannedHours: { type: "number", exclusiveMinimum: 0 },
          actualHours: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["annualFixedCost", "plannedHours", "actualHours"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          plannedPerHour: { type: "number" },
          actualPerHour: { type: "number" },
          utilizationFactor: { type: "number" },
        },
        required: ["plannedPerHour", "actualPerHour", "utilizationFactor"],
      },
      ports: {
        inputs: [
          {
            id: "annualFixedCost",
            label: "Annual Fixed Cost",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "plannedHours",
            label: "Planned Hours",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "actualHours",
            label: "Actual Hours",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "plannedPerHour",
            label: "Planned Per Hour",
            valueType: { type: "number" },
          },
          {
            id: "actualPerHour",
            label: "Actual Per Hour",
            valueType: { type: "number" },
          },
          {
            id: "utilizationFactor",
            label: "Utilization Factor",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = machineryFixedCostUtilizationFactorTool.execute;
export default machineryFixedCostUtilizationFactorTool;
