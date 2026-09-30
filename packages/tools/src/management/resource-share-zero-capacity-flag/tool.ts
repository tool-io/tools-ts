import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly demand: number; readonly capacity: number };
export type Output = {
  readonly defined: boolean;
  readonly utilization: number;
  readonly overload: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    demand: { type: "number", minimum: 0 },
    capacity: { type: "number", minimum: 0 },
  },
  required: ["demand", "capacity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    defined: { type: "boolean" },
    utilization: { type: "number" },
    overload: { type: "number" },
  },
  required: ["defined", "utilization", "overload"],
} as const;
/** Calculate resource share zero capacity flag from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { demand, capacity } = request;
  const compute = (): Output => {
    H.domain(demand >= 0 && capacity >= 0);
    return {
      defined: capacity > 0,
      utilization: capacity > 0 ? demand / capacity : 0,
      overload: Math.max(0, demand - capacity),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { demand: 10, capacity: 0 },
  output: { defined: false, utilization: 0, overload: 10 },
} satisfies ToolExample<Input, Output>;
export const resourceShareZeroCapacityFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "management/resource-share-zero-capacity-flag",
    title: "Resource Share Zero Capacity Flag Tool",
    description:
      "Calculate resource share zero capacity flag from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        demand: { type: "number", minimum: 0 },
        capacity: { type: "number", minimum: 0 },
      },
      required: ["demand", "capacity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        defined: { type: "boolean" },
        utilization: { type: "number" },
        overload: { type: "number" },
      },
      required: ["defined", "utilization", "overload"],
    },
    ports: {
      inputs: [
        {
          id: "demand",
          label: "Demand",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "capacity",
          label: "Capacity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
        {
          id: "utilization",
          label: "Utilization",
          valueType: { type: "number" },
        },
        { id: "overload", label: "Overload", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = resourceShareZeroCapacityFlagTool.execute;
export default resourceShareZeroCapacityFlagTool;
