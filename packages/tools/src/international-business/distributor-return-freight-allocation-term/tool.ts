import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly returnFreightCost: number;
  readonly distributorFraction: number;
};
export type Output = {
  readonly distributorCost: number;
  readonly supplierCost: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    returnFreightCost: { type: "number", minimum: 0 },
    distributorFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["returnFreightCost", "distributorFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distributorCost: { type: "number" },
    supplierCost: { type: "number" },
  },
  required: ["distributorCost", "supplierCost"],
} as const;
/** Split supplied return freight cost by an explicit distributor fraction without selecting liability or shipping terms. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { returnFreightCost, distributorFraction } = request;
  const compute = (): Output => {
    H.domain(returnFreightCost >= 0, "returnFreightCost");
    (H.domain(
      distributorFraction >= 0 && distributorFraction <= 1,
      "distributorFraction",
    ),
      distributorFraction);
    return {
      distributorCost: returnFreightCost * distributorFraction,
      supplierCost: returnFreightCost * (1 - distributorFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { returnFreightCost: 100, distributorFraction: 0.25 },
  output: { distributorCost: 25, supplierCost: 75 },
} satisfies ToolExample<Input, Output>;
export const distributorReturnFreightAllocationTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "international-business/distributor-return-freight-allocation-term",
      title: "Distributor Return Freight Allocation Term Tool",
      description:
        "Split supplied return freight cost by an explicit distributor fraction without selecting liability or shipping terms.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          returnFreightCost: { type: "number", minimum: 0 },
          distributorFraction: { type: "number", minimum: 0, maximum: 1 },
        },
        required: ["returnFreightCost", "distributorFraction"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          distributorCost: { type: "number" },
          supplierCost: { type: "number" },
        },
        required: ["distributorCost", "supplierCost"],
      },
      ports: {
        inputs: [
          {
            id: "returnFreightCost",
            label: "Return Freight Cost",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "distributorFraction",
            label: "Distributor Fraction",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "distributorCost",
            label: "Distributor Cost",
            valueType: { type: "number" },
          },
          {
            id: "supplierCost",
            label: "Supplier Cost",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = distributorReturnFreightAllocationTermTool.execute;
export default distributorReturnFreightAllocationTermTool;
