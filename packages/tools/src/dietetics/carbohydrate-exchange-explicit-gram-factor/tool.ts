import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly carbohydrateGrams: number;
  readonly gramsPerExchange: number;
};
export type Output = { readonly exchanges: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    carbohydrateGrams: { type: "number", minimum: 0 },
    gramsPerExchange: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["carbohydrateGrams", "gramsPerExchange"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { exchanges: { type: "number" } },
  required: ["exchanges"],
} as const;
/** Caller-defined exchange factor only; no meal plan or treatment recommendation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { carbohydrateGrams, gramsPerExchange } = request;
  const compute = (): Output => {
    H.domain(carbohydrateGrams >= 0);
    H.positive(gramsPerExchange);
    return { exchanges: carbohydrateGrams / gramsPerExchange };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { carbohydrateGrams: 45, gramsPerExchange: 15 },
  output: { exchanges: 3 },
} satisfies ToolExample<Input, Output>;
export const carbohydrateExchangeExplicitGramFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "dietetics/carbohydrate-exchange-explicit-gram-factor",
      title: "Carbohydrate Exchange Explicit Gram Factor Tool",
      description:
        "Caller-defined exchange factor only; no meal plan or treatment recommendation.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          carbohydrateGrams: { type: "number", minimum: 0 },
          gramsPerExchange: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["carbohydrateGrams", "gramsPerExchange"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { exchanges: { type: "number" } },
        required: ["exchanges"],
      },
      ports: {
        inputs: [
          {
            id: "carbohydrateGrams",
            label: "Carbohydrate Grams",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "gramsPerExchange",
            label: "Grams Per Exchange",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "exchanges",
            label: "Exchanges",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = carbohydrateExchangeExplicitGramFactorTool.execute;
export default carbohydrateExchangeExplicitGramFactorTool;
