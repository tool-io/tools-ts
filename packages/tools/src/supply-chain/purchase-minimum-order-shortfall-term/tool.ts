import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requested: number;
  readonly minimum: number;
  readonly unitPrice: number;
};
export type Output = {
  readonly shortfall: number;
  readonly requiredSpend: number;
  readonly incrementalSpend: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requested: { type: "integer", minimum: 0 },
    minimum: { type: "integer", minimum: 0 },
    unitPrice: { type: "number", minimum: 0 },
  },
  required: ["requested", "minimum", "unitPrice"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shortfall: { type: "integer" },
    requiredSpend: { type: "number" },
    incrementalSpend: { type: "number" },
  },
  required: ["shortfall", "requiredSpend", "incrementalSpend"],
} as const;
/** Calculate purchase minimum order shortfall term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requested, minimum, unitPrice } = request;
  const compute = (): Output => {
    H.integer(requested, 0);
    H.integer(minimum, 0);
    H.domain(unitPrice >= 0);
    return {
      shortfall: Math.max(0, minimum - requested),
      requiredSpend: Math.max(requested, minimum) * unitPrice,
      incrementalSpend: Math.max(0, minimum - requested) * unitPrice,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { requested: 30, minimum: 50, unitPrice: 2 },
  output: { shortfall: 20, requiredSpend: 100, incrementalSpend: 40 },
} satisfies ToolExample<Input, Output>;
export const purchaseMinimumOrderShortfallTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "supply-chain/purchase-minimum-order-shortfall-term",
    title: "Purchase Minimum Order Shortfall Term Tool",
    description:
      "Calculate purchase minimum order shortfall term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requested: { type: "integer", minimum: 0 },
        minimum: { type: "integer", minimum: 0 },
        unitPrice: { type: "number", minimum: 0 },
      },
      required: ["requested", "minimum", "unitPrice"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        shortfall: { type: "integer" },
        requiredSpend: { type: "number" },
        incrementalSpend: { type: "number" },
      },
      required: ["shortfall", "requiredSpend", "incrementalSpend"],
    },
    ports: {
      inputs: [
        {
          id: "requested",
          label: "Requested",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "minimum",
          label: "Minimum",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "unitPrice",
          label: "Unit Price",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "shortfall", label: "Shortfall", valueType: { type: "integer" } },
        {
          id: "requiredSpend",
          label: "Required Spend",
          valueType: { type: "number" },
        },
        {
          id: "incrementalSpend",
          label: "Incremental Spend",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = purchaseMinimumOrderShortfallTermTool.execute;
export default purchaseMinimumOrderShortfallTermTool;
