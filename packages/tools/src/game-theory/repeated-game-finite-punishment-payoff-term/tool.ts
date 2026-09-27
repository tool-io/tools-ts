import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cooperatePayoff: number;
  readonly deviationPayoff: number;
  readonly punishmentPayoff: number;
  readonly discount: number;
  readonly punishmentPeriods: number;
};
export type Output = {
  readonly deviationGain: number;
  readonly discountedPunishmentLoss: number;
  readonly deters: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cooperatePayoff: { type: "number" },
    deviationPayoff: { type: "number" },
    punishmentPayoff: { type: "number" },
    discount: { type: "number", minimum: 0, maximum: 1 },
    punishmentPeriods: { type: "integer", minimum: 0 },
  },
  required: [
    "cooperatePayoff",
    "deviationPayoff",
    "punishmentPayoff",
    "discount",
    "punishmentPeriods",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    deviationGain: { type: "number" },
    discountedPunishmentLoss: { type: "number" },
    deters: { type: "boolean" },
  },
  required: ["deviationGain", "discountedPunishmentLoss", "deters"],
} as const;
/** One deviation today followed by T punishment periods then cooperation, using unnormalized discounted payoffs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    cooperatePayoff,
    deviationPayoff,
    punishmentPayoff,
    discount,
    punishmentPeriods,
  } = request;
  const compute = (): Output => {
    H.probability(discount);
    H.integer(punishmentPeriods, 0);
    return {
      deviationGain: deviationPayoff - cooperatePayoff,
      discountedPunishmentLoss:
        (cooperatePayoff - punishmentPayoff) *
        (discount === 1
          ? punishmentPeriods
          : (discount * (1 - discount ** punishmentPeriods)) / (1 - discount)),
      deters:
        deviationPayoff - cooperatePayoff <=
        (cooperatePayoff - punishmentPayoff) *
          (discount === 1
            ? punishmentPeriods
            : (discount * (1 - discount ** punishmentPeriods)) /
              (1 - discount)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    cooperatePayoff: 3,
    deviationPayoff: 5,
    punishmentPayoff: 1,
    discount: 0.5,
    punishmentPeriods: 2,
  },
  output: { deviationGain: 2, discountedPunishmentLoss: 1.5, deters: false },
} satisfies ToolExample<Input, Output>;
export const repeatedGameFinitePunishmentPayoffTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "game-theory/repeated-game-finite-punishment-payoff-term",
      title: "Repeated Game Finite Punishment Payoff Term Tool",
      description:
        "One deviation today followed by T punishment periods then cooperation, using unnormalized discounted payoffs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          cooperatePayoff: { type: "number" },
          deviationPayoff: { type: "number" },
          punishmentPayoff: { type: "number" },
          discount: { type: "number", minimum: 0, maximum: 1 },
          punishmentPeriods: { type: "integer", minimum: 0 },
        },
        required: [
          "cooperatePayoff",
          "deviationPayoff",
          "punishmentPayoff",
          "discount",
          "punishmentPeriods",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          deviationGain: { type: "number" },
          discountedPunishmentLoss: { type: "number" },
          deters: { type: "boolean" },
        },
        required: ["deviationGain", "discountedPunishmentLoss", "deters"],
      },
      ports: {
        inputs: [
          {
            id: "cooperatePayoff",
            label: "Cooperate Payoff",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "deviationPayoff",
            label: "Deviation Payoff",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "punishmentPayoff",
            label: "Punishment Payoff",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "discount",
            label: "Discount",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "punishmentPeriods",
            label: "Punishment Periods",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "deviationGain",
            label: "Deviation Gain",
            valueType: { type: "number" },
          },
          {
            id: "discountedPunishmentLoss",
            label: "Discounted Punishment Loss",
            valueType: { type: "number" },
          },
          { id: "deters", label: "Deters", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = repeatedGameFinitePunishmentPayoffTermTool.execute;
export default repeatedGameFinitePunishmentPayoffTermTool;
