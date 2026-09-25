import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly futureIncome: number;
  readonly survivalProbability: number;
  readonly discountRate: number;
  readonly years: number;
};
export type Output = { readonly presentExpectedIncome: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    futureIncome: { type: "number" },
    survivalProbability: { type: "number", minimum: 0, maximum: 1 },
    discountRate: { type: "number", exclusiveMinimum: -1 },
    years: { type: "number", minimum: 0 },
  },
  required: ["futureIncome", "survivalProbability", "discountRate", "years"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { presentExpectedIncome: { type: "number" } },
  required: ["presentExpectedIncome"],
} as const;
/** Calculate survival weighted lifetime income term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { futureIncome, survivalProbability, discountRate, years } = request;
  const compute = (): Output => {
    H.probability(survivalProbability);
    H.domain(discountRate > -1 && years >= 0);
    return {
      presentExpectedIncome:
        (futureIncome * survivalProbability) / (1 + discountRate) ** years,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    futureIncome: 1000,
    survivalProbability: 0.8,
    discountRate: 0,
    years: 10,
  },
  output: { presentExpectedIncome: 800 },
} satisfies ToolExample<Input, Output>;
export const survivalWeightedLifetimeIncomeTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "demographic-economics/survival-weighted-lifetime-income-term",
    title: "Survival Weighted Lifetime Income Term Tool",
    description:
      "Calculate survival weighted lifetime income term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        futureIncome: { type: "number" },
        survivalProbability: { type: "number", minimum: 0, maximum: 1 },
        discountRate: { type: "number", exclusiveMinimum: -1 },
        years: { type: "number", minimum: 0 },
      },
      required: [
        "futureIncome",
        "survivalProbability",
        "discountRate",
        "years",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { presentExpectedIncome: { type: "number" } },
      required: ["presentExpectedIncome"],
    },
    ports: {
      inputs: [
        {
          id: "futureIncome",
          label: "Future Income",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "survivalProbability",
          label: "Survival Probability",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "discountRate",
          label: "Discount Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "years",
          label: "Years",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "presentExpectedIncome",
          label: "Present Expected Income",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = survivalWeightedLifetimeIncomeTermTool.execute;
export default survivalWeightedLifetimeIncomeTermTool;
