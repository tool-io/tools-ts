import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly outputPrice: number;
  readonly inputWorldCost: number;
  readonly outputTariff: number;
  readonly inputTariff: number;
};
export type Output = {
  readonly worldValueAdded: number;
  readonly protectedValueAdded: number;
  readonly effectiveProtection: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outputPrice: { type: "number" },
    inputWorldCost: { type: "number", minimum: 0 },
    outputTariff: { type: "number", exclusiveMinimum: -1 },
    inputTariff: { type: "number", exclusiveMinimum: -1 },
  },
  required: ["outputPrice", "inputWorldCost", "outputTariff", "inputTariff"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    worldValueAdded: { type: "number" },
    protectedValueAdded: { type: "number" },
    effectiveProtection: { type: "number" },
  },
  required: ["worldValueAdded", "protectedValueAdded", "effectiveProtection"],
} as const;
/** Fixed-input effective protection relative to positive world-price value added, without endogenous input substitution. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { outputPrice, inputWorldCost, outputTariff, inputTariff } = request;
  const compute = (): Output => {
    H.domain(
      outputPrice > inputWorldCost &&
        inputWorldCost >= 0 &&
        outputTariff > -1 &&
        inputTariff > -1,
    );
    return {
      worldValueAdded: outputPrice - inputWorldCost,
      protectedValueAdded:
        outputPrice * (1 + outputTariff) - inputWorldCost * (1 + inputTariff),
      effectiveProtection:
        (outputPrice * outputTariff - inputWorldCost * inputTariff) /
        (outputPrice - inputWorldCost),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    outputPrice: 100,
    inputWorldCost: 60,
    outputTariff: 0.1,
    inputTariff: 0.05,
  },
  output: {
    worldValueAdded: 40,
    protectedValueAdded: 47.000000000000014,
    effectiveProtection: 0.175,
  },
} satisfies ToolExample<Input, Output>;
export const effectiveProtectionValueAddedBaseTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "international-economics/effective-protection-value-added-base-term",
      title: "Effective Protection Value Added Base Term Tool",
      description:
        "Fixed-input effective protection relative to positive world-price value added, without endogenous input substitution.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          outputPrice: { type: "number" },
          inputWorldCost: { type: "number", minimum: 0 },
          outputTariff: { type: "number", exclusiveMinimum: -1 },
          inputTariff: { type: "number", exclusiveMinimum: -1 },
        },
        required: [
          "outputPrice",
          "inputWorldCost",
          "outputTariff",
          "inputTariff",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          worldValueAdded: { type: "number" },
          protectedValueAdded: { type: "number" },
          effectiveProtection: { type: "number" },
        },
        required: [
          "worldValueAdded",
          "protectedValueAdded",
          "effectiveProtection",
        ],
      },
      ports: {
        inputs: [
          {
            id: "outputPrice",
            label: "Output Price",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "inputWorldCost",
            label: "Input World Cost",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "outputTariff",
            label: "Output Tariff",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "inputTariff",
            label: "Input Tariff",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "worldValueAdded",
            label: "World Value Added",
            valueType: { type: "number" },
          },
          {
            id: "protectedValueAdded",
            label: "Protected Value Added",
            valueType: { type: "number" },
          },
          {
            id: "effectiveProtection",
            label: "Effective Protection",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = effectiveProtectionValueAddedBaseTermTool.execute;
export default effectiveProtectionValueAddedBaseTermTool;
