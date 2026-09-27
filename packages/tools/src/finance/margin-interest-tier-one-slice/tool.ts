import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly balance: number;
  readonly lower: number;
  readonly upper: number;
  readonly annualRate: number;
  readonly fractionOfYear: number;
};
export type Output = {
  readonly tierBalance: number;
  readonly interest: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    balance: { type: "number", minimum: 0 },
    lower: { type: "number", minimum: 0 },
    upper: { type: "number" },
    annualRate: { type: "number" },
    fractionOfYear: { type: "number", minimum: 0 },
  },
  required: ["balance", "lower", "upper", "annualRate", "fractionOfYear"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tierBalance: { type: "number" }, interest: { type: "number" } },
  required: ["tierBalance", "interest"],
} as const;
/** Calculate margin interest tier one slice from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { balance, lower, upper, annualRate, fractionOfYear } = request;
  const compute = (): Output => {
    H.domain(
      balance >= 0 && lower >= 0 && upper > lower && fractionOfYear >= 0,
    );
    const tierBalance = Math.max(0, Math.min(balance, upper) - lower);
    return { tierBalance, interest: tierBalance * annualRate * fractionOfYear };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    balance: 15000,
    lower: 10000,
    upper: 20000,
    annualRate: 0.08,
    fractionOfYear: 0.25,
  },
  output: { tierBalance: 5000, interest: 100 },
} satisfies ToolExample<Input, Output>;
export const marginInterestTierOneSliceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "finance/margin-interest-tier-one-slice",
    title: "Margin Interest Tier One Slice Tool",
    description:
      "Calculate margin interest tier one slice from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        balance: { type: "number", minimum: 0 },
        lower: { type: "number", minimum: 0 },
        upper: { type: "number" },
        annualRate: { type: "number" },
        fractionOfYear: { type: "number", minimum: 0 },
      },
      required: ["balance", "lower", "upper", "annualRate", "fractionOfYear"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tierBalance: { type: "number" },
        interest: { type: "number" },
      },
      required: ["tierBalance", "interest"],
    },
    ports: {
      inputs: [
        {
          id: "balance",
          label: "Balance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lower",
          label: "Lower",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upper",
          label: "Upper",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "annualRate",
          label: "Annual Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fractionOfYear",
          label: "Fraction Of Year",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "tierBalance",
          label: "Tier Balance",
          valueType: { type: "number" },
        },
        { id: "interest", label: "Interest", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = marginInterestTierOneSliceTool.execute;
export default marginInterestTierOneSliceTool;
