import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly earnedPoints: number;
  readonly pointsPerCurrency: number;
  readonly minimumBonus: number;
  readonly maximumBonus: number;
};
export type Output = {
  readonly unclampedBonus: number;
  readonly bonus: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    earnedPoints: { type: "number", minimum: 0 },
    pointsPerCurrency: { type: "number", exclusiveMinimum: 0 },
    minimumBonus: { type: "number", minimum: 0 },
    maximumBonus: { type: "number" },
  },
  required: [
    "earnedPoints",
    "pointsPerCurrency",
    "minimumBonus",
    "maximumBonus",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { unclampedBonus: { type: "number" }, bonus: { type: "number" } },
  required: ["unclampedBonus", "bonus"],
} as const;
/** Calculate participant bonus exchange rate term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { earnedPoints, pointsPerCurrency, minimumBonus, maximumBonus } =
    request;
  const compute = (): Output => {
    H.domain(
      earnedPoints >= 0 && minimumBonus >= 0 && maximumBonus >= minimumBonus,
    );
    H.positive(pointsPerCurrency);
    return {
      unclampedBonus: earnedPoints / pointsPerCurrency,
      bonus: Math.max(
        minimumBonus,
        Math.min(maximumBonus, earnedPoints / pointsPerCurrency),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    earnedPoints: 250,
    pointsPerCurrency: 100,
    minimumBonus: 1,
    maximumBonus: 5,
  },
  output: { unclampedBonus: 2.5, bonus: 2.5 },
} satisfies ToolExample<Input, Output>;
export const participantBonusExchangeRateTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "experimental-psychology/participant-bonus-exchange-rate-term",
    title: "Participant Bonus Exchange Rate Term Tool",
    description:
      "Calculate participant bonus exchange rate term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        earnedPoints: { type: "number", minimum: 0 },
        pointsPerCurrency: { type: "number", exclusiveMinimum: 0 },
        minimumBonus: { type: "number", minimum: 0 },
        maximumBonus: { type: "number" },
      },
      required: [
        "earnedPoints",
        "pointsPerCurrency",
        "minimumBonus",
        "maximumBonus",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unclampedBonus: { type: "number" },
        bonus: { type: "number" },
      },
      required: ["unclampedBonus", "bonus"],
    },
    ports: {
      inputs: [
        {
          id: "earnedPoints",
          label: "Earned Points",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pointsPerCurrency",
          label: "Points Per Currency",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "minimumBonus",
          label: "Minimum Bonus",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "maximumBonus",
          label: "Maximum Bonus",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "unclampedBonus",
          label: "Unclamped Bonus",
          valueType: { type: "number" },
        },
        { id: "bonus", label: "Bonus", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = participantBonusExchangeRateTermTool.execute;
export default participantBonusExchangeRateTermTool;
