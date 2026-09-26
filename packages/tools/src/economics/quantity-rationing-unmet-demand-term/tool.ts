import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly demand: number; readonly allocation: number };
export type Output = {
  readonly unmet: number;
  readonly excessAllocation: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    demand: { type: "number", minimum: 0 },
    allocation: { type: "number", minimum: 0 },
  },
  required: ["demand", "allocation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unmet: { type: "number" },
    excessAllocation: { type: "number" },
  },
  required: ["unmet", "excessAllocation"],
} as const;
/** Calculate quantity rationing unmet demand term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { demand, allocation } = request;
  const compute = (): Output => {
    H.domain(demand >= 0 && allocation >= 0);
    return {
      unmet: Math.max(0, demand - allocation),
      excessAllocation: Math.max(0, allocation - demand),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { demand: 100, allocation: 80 },
  output: { unmet: 20, excessAllocation: 0 },
} satisfies ToolExample<Input, Output>;
export const quantityRationingUnmetDemandTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "economics/quantity-rationing-unmet-demand-term",
    title: "Quantity Rationing Unmet Demand Term Tool",
    description:
      "Calculate quantity rationing unmet demand term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        demand: { type: "number", minimum: 0 },
        allocation: { type: "number", minimum: 0 },
      },
      required: ["demand", "allocation"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unmet: { type: "number" },
        excessAllocation: { type: "number" },
      },
      required: ["unmet", "excessAllocation"],
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
          id: "allocation",
          label: "Allocation",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "unmet", label: "Unmet", valueType: { type: "number" } },
        {
          id: "excessAllocation",
          label: "Excess Allocation",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = quantityRationingUnmetDemandTermTool.execute;
export default quantityRationingUnmetDemandTermTool;
