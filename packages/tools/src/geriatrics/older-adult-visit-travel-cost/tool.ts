import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly outboundCost: number;
  readonly returnCost: number;
  readonly reimbursement: number;
};
export type Output = {
  readonly grossTravelCost: number;
  readonly netTravelCost: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outboundCost: { type: "number", minimum: 0 },
    returnCost: { type: "number", minimum: 0 },
    reimbursement: { type: "number", minimum: 0 },
  },
  required: ["outboundCost", "returnCost", "reimbursement"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossTravelCost: { type: "number" },
    netTravelCost: { type: "number" },
  },
  required: ["grossTravelCost", "netTravelCost"],
} as const;
/** Reconcile explicit visit travel costs and reimbursement in one currency, retaining excess reimbursement as a negative net cost. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { outboundCost, returnCost, reimbursement } = request;
  const compute = (): Output => {
    H.domain(
      outboundCost >= 0 && returnCost >= 0 && reimbursement >= 0,
      "outboundCost",
    );
    return {
      grossTravelCost: outboundCost + returnCost,
      netTravelCost: outboundCost + returnCost - reimbursement,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { outboundCost: 12, returnCost: 15, reimbursement: 10 },
  output: { grossTravelCost: 27, netTravelCost: 17 },
} satisfies ToolExample<Input, Output>;
export const olderadultVisitTravelCostTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["geriatrics", "health and medicine"],
      keywords: ["geriatrics", "health and medicine"],
    },
    id: "geriatrics/older-adult-visit-travel-cost",
    title: "Older Adult Visit Travel Cost",
    description:
      "Reconcile explicit visit travel costs and reimbursement in one currency, retaining excess reimbursement as a negative net cost.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        outboundCost: { type: "number", minimum: 0 },
        returnCost: { type: "number", minimum: 0 },
        reimbursement: { type: "number", minimum: 0 },
      },
      required: ["outboundCost", "returnCost", "reimbursement"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossTravelCost: { type: "number" },
        netTravelCost: { type: "number" },
      },
      required: ["grossTravelCost", "netTravelCost"],
    },
    ports: {
      inputs: [
        {
          id: "outboundCost",
          label: "Outbound Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "returnCost",
          label: "Return Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reimbursement",
          label: "Reimbursement",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "grossTravelCost",
          label: "Gross Travel Cost",
          valueType: { type: "number" },
        },
        {
          id: "netTravelCost",
          label: "Net Travel Cost",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = olderadultVisitTravelCostTool.execute;
export default olderadultVisitTravelCostTool;
