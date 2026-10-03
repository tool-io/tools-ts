import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly participants: number;
  readonly unitIncentive: number;
  readonly redemptionFraction: number;
  readonly administration: number;
  readonly recovered: number;
};
export type Output = {
  readonly grossLiability: number;
  readonly expectedRedeemed: number;
  readonly netExpense: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    participants: { type: "integer", minimum: 0 },
    unitIncentive: { type: "number", minimum: 0 },
    redemptionFraction: { type: "number", minimum: 0, maximum: 1 },
    administration: { type: "number", minimum: 0 },
    recovered: { type: "number", minimum: 0 },
  },
  required: [
    "participants",
    "unitIncentive",
    "redemptionFraction",
    "administration",
    "recovered",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossLiability: { type: "number" },
    expectedRedeemed: { type: "number" },
    netExpense: { type: "number" },
  },
  required: ["grossLiability", "expectedRedeemed", "netExpense"],
} as const;
/** Calculate public health program incentive netterm from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    participants,
    unitIncentive,
    redemptionFraction,
    administration,
    recovered,
  } = request;
  const compute = (): Output => {
    H.integer(participants, 0);
    H.domain(unitIncentive >= 0 && administration >= 0 && recovered >= 0);
    H.probability(redemptionFraction);
    return {
      grossLiability: participants * unitIncentive,
      expectedRedeemed: participants * unitIncentive * redemptionFraction,
      netExpense:
        participants * unitIncentive * redemptionFraction +
        administration -
        recovered,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    participants: 100,
    unitIncentive: 5,
    redemptionFraction: 0.8,
    administration: 20,
    recovered: 10,
  },
  output: { grossLiability: 500, expectedRedeemed: 400, netExpense: 410 },
} satisfies ToolExample<Input, Output>;
export const publicHealthProgramIncentiveNettermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "public-health/public-health-program-incentive-netterm",
      title: "Public Health Program Incentive Netterm Tool",
      description:
        "Calculate public health program incentive netterm from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          participants: { type: "integer", minimum: 0 },
          unitIncentive: { type: "number", minimum: 0 },
          redemptionFraction: { type: "number", minimum: 0, maximum: 1 },
          administration: { type: "number", minimum: 0 },
          recovered: { type: "number", minimum: 0 },
        },
        required: [
          "participants",
          "unitIncentive",
          "redemptionFraction",
          "administration",
          "recovered",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          grossLiability: { type: "number" },
          expectedRedeemed: { type: "number" },
          netExpense: { type: "number" },
        },
        required: ["grossLiability", "expectedRedeemed", "netExpense"],
      },
      ports: {
        inputs: [
          {
            id: "participants",
            label: "Participants",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "unitIncentive",
            label: "Unit Incentive",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "redemptionFraction",
            label: "Redemption Fraction",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "administration",
            label: "Administration",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "recovered",
            label: "Recovered",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "grossLiability",
            label: "Gross Liability",
            valueType: { type: "number" },
          },
          {
            id: "expectedRedeemed",
            label: "Expected Redeemed",
            valueType: { type: "number" },
          },
          {
            id: "netExpense",
            label: "Net Expense",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = publicHealthProgramIncentiveNettermTool.execute;
export default publicHealthProgramIncentiveNettermTool;
