import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly memberEligibleTrade: number;
  readonly totalEligibleTrade: number;
  readonly distributableSurplus: number;
  readonly retainedFraction: number;
};
export type Output = {
  readonly share: number;
  readonly allocated: number;
  readonly cashPaid: number;
  readonly retained: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    memberEligibleTrade: { type: "number", minimum: 0 },
    totalEligibleTrade: { type: "number", exclusiveMinimum: 0 },
    distributableSurplus: { type: "number", minimum: 0 },
    retainedFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "memberEligibleTrade",
    "totalEligibleTrade",
    "distributableSurplus",
    "retainedFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    share: { type: "number" },
    allocated: { type: "number" },
    cashPaid: { type: "number" },
    retained: { type: "number" },
  },
  required: ["share", "allocated", "cashPaid", "retained"],
} as const;
/** Calculate cooperative member patronage share term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    memberEligibleTrade,
    totalEligibleTrade,
    distributableSurplus,
    retainedFraction,
  } = request;
  const compute = (): Output => {
    H.positive(totalEligibleTrade);
    H.domain(
      memberEligibleTrade >= 0 &&
        memberEligibleTrade <= totalEligibleTrade &&
        distributableSurplus >= 0,
    );
    H.probability(retainedFraction);
    return {
      share: memberEligibleTrade / totalEligibleTrade,
      allocated:
        (distributableSurplus * memberEligibleTrade) / totalEligibleTrade,
      cashPaid:
        ((distributableSurplus * memberEligibleTrade) / totalEligibleTrade) *
        (1 - retainedFraction),
      retained:
        ((distributableSurplus * memberEligibleTrade) / totalEligibleTrade) *
        retainedFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    memberEligibleTrade: 100,
    totalEligibleTrade: 1000,
    distributableSurplus: 500,
    retainedFraction: 0.2,
  },
  output: { share: 0.1, allocated: 50, cashPaid: 40, retained: 10 },
} satisfies ToolExample<Input, Output>;
export const cooperativeMemberPatronageShareTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "agribusiness/cooperative-member-patronage-share-term",
      title: "Cooperative Member Patronage Share Term Tool",
      description:
        "Calculate cooperative member patronage share term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          memberEligibleTrade: { type: "number", minimum: 0 },
          totalEligibleTrade: { type: "number", exclusiveMinimum: 0 },
          distributableSurplus: { type: "number", minimum: 0 },
          retainedFraction: { type: "number", minimum: 0, maximum: 1 },
        },
        required: [
          "memberEligibleTrade",
          "totalEligibleTrade",
          "distributableSurplus",
          "retainedFraction",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          share: { type: "number" },
          allocated: { type: "number" },
          cashPaid: { type: "number" },
          retained: { type: "number" },
        },
        required: ["share", "allocated", "cashPaid", "retained"],
      },
      ports: {
        inputs: [
          {
            id: "memberEligibleTrade",
            label: "Member Eligible Trade",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "totalEligibleTrade",
            label: "Total Eligible Trade",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "distributableSurplus",
            label: "Distributable Surplus",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "retainedFraction",
            label: "Retained Fraction",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "share", label: "Share", valueType: { type: "number" } },
          {
            id: "allocated",
            label: "Allocated",
            valueType: { type: "number" },
          },
          { id: "cashPaid", label: "Cash Paid", valueType: { type: "number" } },
          { id: "retained", label: "Retained", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = cooperativeMemberPatronageShareTermTool.execute;
export default cooperativeMemberPatronageShareTermTool;
