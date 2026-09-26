import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly oldWeight: number;
  readonly oldFineness: number;
  readonly newWeight: number;
  readonly newFineness: number;
};
export type Output = {
  readonly metalRatio: number;
  readonly metalLossFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    oldWeight: { type: "number", exclusiveMinimum: 0 },
    oldFineness: { type: "number", exclusiveMinimum: 0, maximum: 1 },
    newWeight: { type: "number", minimum: 0 },
    newFineness: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["oldWeight", "oldFineness", "newWeight", "newFineness"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    metalRatio: { type: "number" },
    metalLossFraction: { type: "number" },
  },
  required: ["metalRatio", "metalLossFraction"],
} as const;
/** Calculate historic currency debasement metal ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { oldWeight, oldFineness, newWeight, newFineness } = request;
  const compute = (): Output => {
    H.positive(oldWeight);
    H.positive(oldFineness);
    H.domain(oldFineness <= 1 && newWeight >= 0);
    H.probability(newFineness);
    return {
      metalRatio: (newWeight * newFineness) / (oldWeight * oldFineness),
      metalLossFraction:
        1 - (newWeight * newFineness) / (oldWeight * oldFineness),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { oldWeight: 10, oldFineness: 0.9, newWeight: 9, newFineness: 0.8 },
  output: { metalRatio: 0.8, metalLossFraction: 0.19999999999999996 },
} satisfies ToolExample<Input, Output>;
export const historicCurrencyDebasementMetalRatioTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "economic-history/historic-currency-debasement-metal-ratio",
      title: "Historic Currency Debasement Metal Ratio Tool",
      description:
        "Calculate historic currency debasement metal ratio from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          oldWeight: { type: "number", exclusiveMinimum: 0 },
          oldFineness: { type: "number", exclusiveMinimum: 0, maximum: 1 },
          newWeight: { type: "number", minimum: 0 },
          newFineness: { type: "number", minimum: 0, maximum: 1 },
        },
        required: ["oldWeight", "oldFineness", "newWeight", "newFineness"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          metalRatio: { type: "number" },
          metalLossFraction: { type: "number" },
        },
        required: ["metalRatio", "metalLossFraction"],
      },
      ports: {
        inputs: [
          {
            id: "oldWeight",
            label: "Old Weight",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "oldFineness",
            label: "Old Fineness",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "newWeight",
            label: "New Weight",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "newFineness",
            label: "New Fineness",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "metalRatio",
            label: "Metal Ratio",
            valueType: { type: "number" },
          },
          {
            id: "metalLossFraction",
            label: "Metal Loss Fraction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = historicCurrencyDebasementMetalRatioTool.execute;
export default historicCurrencyDebasementMetalRatioTool;
