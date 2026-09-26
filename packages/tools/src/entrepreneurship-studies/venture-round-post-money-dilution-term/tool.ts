import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly preMoney: number;
  readonly investment: number;
  readonly previousShares: number;
  readonly founderShares: number;
};
export type Output = {
  readonly postMoney: number;
  readonly newShares: number;
  readonly founderPostFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    preMoney: { type: "number", exclusiveMinimum: 0 },
    investment: { type: "number", minimum: 0 },
    previousShares: { type: "number", exclusiveMinimum: 0 },
    founderShares: { type: "number", minimum: 0 },
  },
  required: ["preMoney", "investment", "previousShares", "founderShares"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    postMoney: { type: "number" },
    newShares: { type: "number" },
    founderPostFraction: { type: "number" },
  },
  required: ["postMoney", "newShares", "founderPostFraction"],
} as const;
/** Calculate venture round post money dilution term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { preMoney, investment, previousShares, founderShares } = request;
  const compute = (): Output => {
    H.positive(preMoney);
    H.positive(previousShares);
    H.domain(
      investment >= 0 && founderShares >= 0 && founderShares <= previousShares,
    );
    return {
      postMoney: preMoney + investment,
      newShares: (previousShares * investment) / preMoney,
      founderPostFraction:
        founderShares / (previousShares * (1 + investment / preMoney)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    preMoney: 8000000,
    investment: 2000000,
    previousShares: 1000000,
    founderShares: 600000,
  },
  output: { postMoney: 10000000, newShares: 250000, founderPostFraction: 0.48 },
} satisfies ToolExample<Input, Output>;
export const ventureRoundPostMoneyDilutionTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entrepreneurship-studies/venture-round-post-money-dilution-term",
    title: "Venture Round Post Money Dilution Term Tool",
    description:
      "Calculate venture round post money dilution term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        preMoney: { type: "number", exclusiveMinimum: 0 },
        investment: { type: "number", minimum: 0 },
        previousShares: { type: "number", exclusiveMinimum: 0 },
        founderShares: { type: "number", minimum: 0 },
      },
      required: ["preMoney", "investment", "previousShares", "founderShares"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        postMoney: { type: "number" },
        newShares: { type: "number" },
        founderPostFraction: { type: "number" },
      },
      required: ["postMoney", "newShares", "founderPostFraction"],
    },
    ports: {
      inputs: [
        {
          id: "preMoney",
          label: "Pre Money",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "investment",
          label: "Investment",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "previousShares",
          label: "Previous Shares",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "founderShares",
          label: "Founder Shares",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "postMoney", label: "Post Money", valueType: { type: "number" } },
        { id: "newShares", label: "New Shares", valueType: { type: "number" } },
        {
          id: "founderPostFraction",
          label: "Founder Post Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = ventureRoundPostMoneyDilutionTermTool.execute;
export default ventureRoundPostMoneyDilutionTermTool;
