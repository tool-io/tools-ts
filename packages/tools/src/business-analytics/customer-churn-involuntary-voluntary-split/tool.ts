import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startingCustomers: number;
  readonly voluntary: number;
  readonly involuntary: number;
  readonly otherLosses: number;
};
export type Output = {
  readonly totalLost: number;
  readonly churnRate: number;
  readonly voluntaryRate: number;
  readonly involuntaryRate: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startingCustomers: { type: "integer", minimum: 1 },
    voluntary: { type: "integer", minimum: 0 },
    involuntary: { type: "integer", minimum: 0 },
    otherLosses: { type: "integer", minimum: 0 },
  },
  required: ["startingCustomers", "voluntary", "involuntary", "otherLosses"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalLost: { type: "integer" },
    churnRate: { type: "number" },
    voluntaryRate: { type: "number" },
    involuntaryRate: { type: "number" },
  },
  required: ["totalLost", "churnRate", "voluntaryRate", "involuntaryRate"],
} as const;
/** Disjoint classified losses on the opening-customer denominator; new acquisitions are excluded. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { startingCustomers, voluntary, involuntary, otherLosses } = request;
  const compute = (): Output => {
    H.integer(startingCustomers, 1);
    H.integer(voluntary, 0);
    H.integer(involuntary, 0);
    H.integer(otherLosses, 0);
    H.domain(voluntary + involuntary + otherLosses <= startingCustomers);
    return {
      totalLost: voluntary + involuntary + otherLosses,
      churnRate: (voluntary + involuntary + otherLosses) / startingCustomers,
      voluntaryRate: voluntary / startingCustomers,
      involuntaryRate: involuntary / startingCustomers,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    startingCustomers: 100,
    voluntary: 5,
    involuntary: 3,
    otherLosses: 2,
  },
  output: {
    totalLost: 10,
    churnRate: 0.1,
    voluntaryRate: 0.05,
    involuntaryRate: 0.03,
  },
} satisfies ToolExample<Input, Output>;
export const customerChurnInvoluntaryVoluntarySplitTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "business-analytics/customer-churn-involuntary-voluntary-split",
      title: "Customer Churn Involuntary Voluntary Split Tool",
      description:
        "Disjoint classified losses on the opening-customer denominator; new acquisitions are excluded.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          startingCustomers: { type: "integer", minimum: 1 },
          voluntary: { type: "integer", minimum: 0 },
          involuntary: { type: "integer", minimum: 0 },
          otherLosses: { type: "integer", minimum: 0 },
        },
        required: [
          "startingCustomers",
          "voluntary",
          "involuntary",
          "otherLosses",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          totalLost: { type: "integer" },
          churnRate: { type: "number" },
          voluntaryRate: { type: "number" },
          involuntaryRate: { type: "number" },
        },
        required: [
          "totalLost",
          "churnRate",
          "voluntaryRate",
          "involuntaryRate",
        ],
      },
      ports: {
        inputs: [
          {
            id: "startingCustomers",
            label: "Starting Customers",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "voluntary",
            label: "Voluntary",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "involuntary",
            label: "Involuntary",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "otherLosses",
            label: "Other Losses",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "totalLost",
            label: "Total Lost",
            valueType: { type: "integer" },
          },
          {
            id: "churnRate",
            label: "Churn Rate",
            valueType: { type: "number" },
          },
          {
            id: "voluntaryRate",
            label: "Voluntary Rate",
            valueType: { type: "number" },
          },
          {
            id: "involuntaryRate",
            label: "Involuntary Rate",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = customerChurnInvoluntaryVoluntarySplitTool.execute;
export default customerChurnInvoluntaryVoluntarySplitTool;
