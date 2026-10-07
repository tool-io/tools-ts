import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossRevenue: number;
  readonly returnedRevenue: number;
  readonly originalCost: number;
  readonly recoveredReturnedCost: number;
};
export type Output = {
  readonly netRevenue: number;
  readonly netCost: number;
  readonly margin: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossRevenue: { type: "number", minimum: 0 },
    returnedRevenue: { type: "number", minimum: 0 },
    originalCost: { type: "number", minimum: 0 },
    recoveredReturnedCost: { type: "number", minimum: 0 },
  },
  required: [
    "grossRevenue",
    "returnedRevenue",
    "originalCost",
    "recoveredReturnedCost",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netRevenue: { type: "number" },
    netCost: { type: "number" },
    margin: { type: "number" },
  },
  required: ["netRevenue", "netCost", "margin"],
} as const;
/** Reconcile one order line’s revenue and cost after explicit return revenue and recovered inventory cost. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossRevenue, returnedRevenue, originalCost, recoveredReturnedCost } =
    request;
  const compute = (): Output => {
    H.domain(
      grossRevenue >= 0 &&
        returnedRevenue >= 0 &&
        returnedRevenue <= grossRevenue &&
        originalCost >= 0 &&
        recoveredReturnedCost >= 0 &&
        recoveredReturnedCost <= originalCost,
      "grossRevenue",
    );
    return {
      netRevenue: grossRevenue - returnedRevenue,
      netCost: originalCost - recoveredReturnedCost,
      margin:
        grossRevenue - returnedRevenue - originalCost + recoveredReturnedCost,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    grossRevenue: 200,
    returnedRevenue: 50,
    originalCost: 120,
    recoveredReturnedCost: 30,
  },
  output: { netRevenue: 150, netCost: 90, margin: 60 },
} satisfies ToolExample<Input, Output>;
export const orderLineReturnAdjustedMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "business-analytics",
        "business analytics",
        "business and finance",
      ],
      keywords: ["business analytics", "business and finance"],
    },
    id: "business-analytics/order-line-return-adjusted-margin",
    title: "Order Line Return Adjusted Margin",
    description:
      "Reconcile one order line’s revenue and cost after explicit return revenue and recovered inventory cost.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossRevenue: { type: "number", minimum: 0 },
        returnedRevenue: { type: "number", minimum: 0 },
        originalCost: { type: "number", minimum: 0 },
        recoveredReturnedCost: { type: "number", minimum: 0 },
      },
      required: [
        "grossRevenue",
        "returnedRevenue",
        "originalCost",
        "recoveredReturnedCost",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netRevenue: { type: "number" },
        netCost: { type: "number" },
        margin: { type: "number" },
      },
      required: ["netRevenue", "netCost", "margin"],
    },
    ports: {
      inputs: [
        {
          id: "grossRevenue",
          label: "Gross Revenue",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "returnedRevenue",
          label: "Returned Revenue",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "originalCost",
          label: "Original Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recoveredReturnedCost",
          label: "Recovered Returned Cost",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "netRevenue",
          label: "Net Revenue",
          valueType: { type: "number" },
        },
        { id: "netCost", label: "Net Cost", valueType: { type: "number" } },
        { id: "margin", label: "Margin", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = orderLineReturnAdjustedMarginTool.execute;
export default orderLineReturnAdjustedMarginTool;
