import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firmQuantity: number;
  readonly inverseDemandSlope: number;
};
export type Output = { readonly priceMinusMarginalCost: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firmQuantity: { type: "number", minimum: 0 },
    inverseDemandSlope: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["firmQuantity", "inverseDemandSlope"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { priceMinusMarginalCost: { type: "number" } },
  required: ["priceMinusMarginalCost"],
} as const;
/** Return the interior Cournot first-order-condition markup for constant-slope inverse demand p=a-b*Q. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firmQuantity, inverseDemandSlope } = request;
  const compute = (): Output => {
    H.domain(firmQuantity >= 0);
    H.positive(inverseDemandSlope);
    return { priceMinusMarginalCost: firmQuantity * inverseDemandSlope };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firmQuantity: 20, inverseDemandSlope: 2 },
  output: { priceMinusMarginalCost: 40 },
} satisfies ToolExample<Input, Output>;
export const cournotOneFirmMarkupTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "economics/cournot-one-firm-markup-term",
    title: "Cournot One Firm Markup Term Tool",
    description:
      "Return the interior Cournot first-order-condition markup for constant-slope inverse demand p=a-b*Q.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firmQuantity: { type: "number", minimum: 0 },
        inverseDemandSlope: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["firmQuantity", "inverseDemandSlope"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { priceMinusMarginalCost: { type: "number" } },
      required: ["priceMinusMarginalCost"],
    },
    ports: {
      inputs: [
        {
          id: "firmQuantity",
          label: "Firm Quantity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inverseDemandSlope",
          label: "Inverse Demand Slope",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "priceMinusMarginalCost",
          label: "Price Minus Marginal Cost",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cournotOneFirmMarkupTermTool.execute;
export default cournotOneFirmMarkupTermTool;
