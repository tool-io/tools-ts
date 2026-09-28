import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly hours: number;
  readonly replacementHourlyCost: number;
  readonly foregoneHourlyEarnings: number;
  readonly useReplacement: boolean;
  readonly reimbursed: number;
};
export type Output = { readonly grossValue: number; readonly netValue: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hours: { type: "number", minimum: 0 },
    replacementHourlyCost: { type: "number", minimum: 0 },
    foregoneHourlyEarnings: { type: "number", minimum: 0 },
    useReplacement: { type: "boolean" },
    reimbursed: { type: "number", minimum: 0 },
  },
  required: [
    "hours",
    "replacementHourlyCost",
    "foregoneHourlyEarnings",
    "useReplacement",
    "reimbursed",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { grossValue: { type: "number" }, netValue: { type: "number" } },
  required: ["grossValue", "netValue"],
} as const;
/** Explicit replacement-cost or opportunity-cost valuation for one care-time block, without combining both valuations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    hours,
    replacementHourlyCost,
    foregoneHourlyEarnings,
    useReplacement,
    reimbursed,
  } = request;
  const compute = (): Output => {
    H.domain(
      hours >= 0 &&
        replacementHourlyCost >= 0 &&
        foregoneHourlyEarnings >= 0 &&
        reimbursed >= 0,
    );
    return {
      grossValue:
        hours *
        (useReplacement ? replacementHourlyCost : foregoneHourlyEarnings),
      netValue:
        hours *
          (useReplacement ? replacementHourlyCost : foregoneHourlyEarnings) -
        reimbursed,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    hours: 20,
    replacementHourlyCost: 25,
    foregoneHourlyEarnings: 15,
    useReplacement: true,
    reimbursed: 100,
  },
  output: { grossValue: 500, netValue: 400 },
} satisfies ToolExample<Input, Output>;
export const informalCareHourValueTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-economics/informal-care-hour-value-term",
    title: "Informal Care Hour Value Term Tool",
    description:
      "Explicit replacement-cost or opportunity-cost valuation for one care-time block, without combining both valuations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        hours: { type: "number", minimum: 0 },
        replacementHourlyCost: { type: "number", minimum: 0 },
        foregoneHourlyEarnings: { type: "number", minimum: 0 },
        useReplacement: { type: "boolean" },
        reimbursed: { type: "number", minimum: 0 },
      },
      required: [
        "hours",
        "replacementHourlyCost",
        "foregoneHourlyEarnings",
        "useReplacement",
        "reimbursed",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossValue: { type: "number" },
        netValue: { type: "number" },
      },
      required: ["grossValue", "netValue"],
    },
    ports: {
      inputs: [
        {
          id: "hours",
          label: "Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "replacementHourlyCost",
          label: "Replacement Hourly Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "foregoneHourlyEarnings",
          label: "Foregone Hourly Earnings",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "useReplacement",
          label: "Use Replacement",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "reimbursed",
          label: "Reimbursed",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "grossValue",
          label: "Gross Value",
          valueType: { type: "number" },
        },
        { id: "netValue", label: "Net Value", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = informalCareHourValueTermTool.execute;
export default informalCareHourValueTermTool;
