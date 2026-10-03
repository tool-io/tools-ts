import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly income: number;
  readonly lowerIncome: number;
  readonly upperIncome: number;
  readonly fullSubsidy: number;
};
export type Output = {
  readonly retainedFraction: number;
  readonly subsidy: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    income: { type: "number", minimum: 0 },
    lowerIncome: { type: "number", minimum: 0 },
    upperIncome: { type: "number" },
    fullSubsidy: { type: "number", minimum: 0 },
  },
  required: ["income", "lowerIncome", "upperIncome", "fullSubsidy"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    retainedFraction: { type: "number" },
    subsidy: { type: "number" },
  },
  required: ["retainedFraction", "subsidy"],
} as const;
/** Calculate subsidy phaseout one income band from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { income, lowerIncome, upperIncome, fullSubsidy } = request;
  const compute = (): Output => {
    H.domain(
      lowerIncome >= 0 &&
        upperIncome > lowerIncome &&
        income >= 0 &&
        fullSubsidy >= 0,
    );
    return {
      retainedFraction: Math.max(
        0,
        Math.min(1, (upperIncome - income) / (upperIncome - lowerIncome)),
      ),
      subsidy:
        fullSubsidy *
        Math.max(
          0,
          Math.min(1, (upperIncome - income) / (upperIncome - lowerIncome)),
        ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { income: 150, lowerIncome: 100, upperIncome: 200, fullSubsidy: 80 },
  output: { retainedFraction: 0.5, subsidy: 40 },
} satisfies ToolExample<Input, Output>;
export const subsidyPhaseoutOneIncomeBandTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-policy/subsidy-phaseout-one-income-band",
    title: "Subsidy Phaseout One Income Band Tool",
    description:
      "Calculate subsidy phaseout one income band from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        income: { type: "number", minimum: 0 },
        lowerIncome: { type: "number", minimum: 0 },
        upperIncome: { type: "number" },
        fullSubsidy: { type: "number", minimum: 0 },
      },
      required: ["income", "lowerIncome", "upperIncome", "fullSubsidy"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        retainedFraction: { type: "number" },
        subsidy: { type: "number" },
      },
      required: ["retainedFraction", "subsidy"],
    },
    ports: {
      inputs: [
        {
          id: "income",
          label: "Income",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lowerIncome",
          label: "Lower Income",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upperIncome",
          label: "Upper Income",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fullSubsidy",
          label: "Full Subsidy",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "retainedFraction",
          label: "Retained Fraction",
          valueType: { type: "number" },
        },
        { id: "subsidy", label: "Subsidy", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = subsidyPhaseoutOneIncomeBandTool.execute;
export default subsidyPhaseoutOneIncomeBandTool;
