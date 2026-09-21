import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly ratePerHour: number;
  readonly capacityPerHour: number;
  readonly costPerUnit: number;
};
export type Output = {
  readonly revenuePerUnit: number;
  readonly marginPerUnit: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ratePerHour: { type: "number", minimum: 0 },
    capacityPerHour: { type: "number", exclusiveMinimum: 0 },
    costPerUnit: { type: "number", minimum: 0 },
  },
  required: ["ratePerHour", "capacityPerHour", "costPerUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    revenuePerUnit: { type: "number" },
    marginPerUnit: { type: "number" },
  },
  required: ["revenuePerUnit", "marginPerUnit"],
} as const;
/** Calculate hire rate capacity unit margin from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ratePerHour, capacityPerHour, costPerUnit } = request;
  const compute = (): Output => {
    H.positive(capacityPerHour);
    H.domain(ratePerHour >= 0 && costPerUnit >= 0);
    return {
      revenuePerUnit: ratePerHour / capacityPerHour,
      marginPerUnit: ratePerHour / capacityPerHour - costPerUnit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { ratePerHour: 120, capacityPerHour: 4, costPerUnit: 20 },
  output: { revenuePerUnit: 30, marginPerUnit: 10 },
} satisfies ToolExample<Input, Output>;
export const hireRateCapacityUnitMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agribusiness/hire-rate-capacity-unit-margin",
    title: "Hire Rate Capacity Unit Margin Tool",
    description:
      "Calculate hire rate capacity unit margin from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ratePerHour: { type: "number", minimum: 0 },
        capacityPerHour: { type: "number", exclusiveMinimum: 0 },
        costPerUnit: { type: "number", minimum: 0 },
      },
      required: ["ratePerHour", "capacityPerHour", "costPerUnit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        revenuePerUnit: { type: "number" },
        marginPerUnit: { type: "number" },
      },
      required: ["revenuePerUnit", "marginPerUnit"],
    },
    ports: {
      inputs: [
        {
          id: "ratePerHour",
          label: "Rate Per Hour",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "capacityPerHour",
          label: "Capacity Per Hour",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "costPerUnit",
          label: "Cost Per Unit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "revenuePerUnit",
          label: "Revenue Per Unit",
          valueType: { type: "number" },
        },
        {
          id: "marginPerUnit",
          label: "Margin Per Unit",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = hireRateCapacityUnitMarginTool.execute;
export default hireRateCapacityUnitMarginTool;
