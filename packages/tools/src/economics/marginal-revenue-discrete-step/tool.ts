import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly beforeRevenue: number;
  readonly afterRevenue: number;
  readonly beforeQuantity: number;
  readonly afterQuantity: number;
};
export type Output = { readonly marginalRevenue: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    beforeRevenue: { type: "number" },
    afterRevenue: { type: "number" },
    beforeQuantity: { type: "number", minimum: 0 },
    afterQuantity: { type: "number", minimum: 0 },
  },
  required: [
    "beforeRevenue",
    "afterRevenue",
    "beforeQuantity",
    "afterQuantity",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { marginalRevenue: { type: "number" } },
  required: ["marginalRevenue"],
} as const;
/** Compute discrete revenue change per quantity change between two distinct quantity observations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { beforeRevenue, afterRevenue, beforeQuantity, afterQuantity } =
    request;
  const compute = (): Output => {
    H.domain(
      beforeQuantity >= 0 &&
        afterQuantity >= 0 &&
        beforeQuantity !== afterQuantity,
      "beforeQuantity",
    );
    return {
      marginalRevenue:
        (afterRevenue - beforeRevenue) / (afterQuantity - beforeQuantity),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    beforeRevenue: 100,
    afterRevenue: 135,
    beforeQuantity: 10,
    afterQuantity: 15,
  },
  output: { marginalRevenue: 7 },
} satisfies ToolExample<Input, Output>;
export const marginalRevenueDiscreteStepTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "economics/marginal-revenue-discrete-step",
    title: "Marginal Revenue Discrete Step Tool",
    description:
      "Compute discrete revenue change per quantity change between two distinct quantity observations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        beforeRevenue: { type: "number" },
        afterRevenue: { type: "number" },
        beforeQuantity: { type: "number", minimum: 0 },
        afterQuantity: { type: "number", minimum: 0 },
      },
      required: [
        "beforeRevenue",
        "afterRevenue",
        "beforeQuantity",
        "afterQuantity",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { marginalRevenue: { type: "number" } },
      required: ["marginalRevenue"],
    },
    ports: {
      inputs: [
        {
          id: "beforeRevenue",
          label: "Before Revenue",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "afterRevenue",
          label: "After Revenue",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "beforeQuantity",
          label: "Before Quantity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "afterQuantity",
          label: "After Quantity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "marginalRevenue",
          label: "Marginal Revenue",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = marginalRevenueDiscreteStepTool.execute;
export default marginalRevenueDiscreteStepTool;
