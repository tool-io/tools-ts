import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dailyDemand: number;
  readonly leadDays: number;
  readonly reviewDays: number;
  readonly safetyStock: number;
};
export type Output = {
  readonly leadTimeDemand: number;
  readonly protectionDemand: number;
  readonly targetStock: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dailyDemand: { type: "number", minimum: 0 },
    leadDays: { type: "number", minimum: 0 },
    reviewDays: { type: "number", minimum: 0 },
    safetyStock: { type: "number", minimum: 0 },
  },
  required: ["dailyDemand", "leadDays", "reviewDays", "safetyStock"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leadTimeDemand: { type: "number" },
    protectionDemand: { type: "number" },
    targetStock: { type: "number" },
  },
  required: ["leadTimeDemand", "protectionDemand", "targetStock"],
} as const;
/** Calculate lead time demand one period term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dailyDemand, leadDays, reviewDays, safetyStock } = request;
  const compute = (): Output => {
    H.domain(
      dailyDemand >= 0 && leadDays >= 0 && reviewDays >= 0 && safetyStock >= 0,
    );
    return {
      leadTimeDemand: dailyDemand * leadDays,
      protectionDemand: dailyDemand * (leadDays + reviewDays),
      targetStock: dailyDemand * (leadDays + reviewDays) + safetyStock,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dailyDemand: 10, leadDays: 5, reviewDays: 2, safetyStock: 20 },
  output: { leadTimeDemand: 50, protectionDemand: 70, targetStock: 90 },
} satisfies ToolExample<Input, Output>;
export const leadTimeDemandOnePeriodTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "supply-chain/lead-time-demand-one-period-term",
    title: "Lead Time Demand One Period Term Tool",
    description:
      "Calculate lead time demand one period term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dailyDemand: { type: "number", minimum: 0 },
        leadDays: { type: "number", minimum: 0 },
        reviewDays: { type: "number", minimum: 0 },
        safetyStock: { type: "number", minimum: 0 },
      },
      required: ["dailyDemand", "leadDays", "reviewDays", "safetyStock"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leadTimeDemand: { type: "number" },
        protectionDemand: { type: "number" },
        targetStock: { type: "number" },
      },
      required: ["leadTimeDemand", "protectionDemand", "targetStock"],
    },
    ports: {
      inputs: [
        {
          id: "dailyDemand",
          label: "Daily Demand",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "leadDays",
          label: "Lead Days",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reviewDays",
          label: "Review Days",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "safetyStock",
          label: "Safety Stock",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "leadTimeDemand",
          label: "Lead Time Demand",
          valueType: { type: "number" },
        },
        {
          id: "protectionDemand",
          label: "Protection Demand",
          valueType: { type: "number" },
        },
        {
          id: "targetStock",
          label: "Target Stock",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = leadTimeDemandOnePeriodTermTool.execute;
export default leadTimeDemandOnePeriodTermTool;
