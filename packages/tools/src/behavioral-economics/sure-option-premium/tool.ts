import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sureValue: number;
  readonly expectedAlternativeValue: number;
  readonly referenceValue: number;
};
export type Output = {
  readonly premium: number;
  readonly relativePremium: number;
  readonly relativeDefined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sureValue: { type: "number" },
    expectedAlternativeValue: { type: "number" },
    referenceValue: { type: "number" },
  },
  required: ["sureValue", "expectedAlternativeValue", "referenceValue"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    premium: { type: "number" },
    relativePremium: { type: "number" },
    relativeDefined: { type: "boolean" },
  },
  required: ["premium", "relativePremium", "relativeDefined"],
} as const;
/** Compare supplied sure and expected alternative values under an explicit normalization base. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sureValue, expectedAlternativeValue, referenceValue } = request;
  const compute = (): Output => {
    return {
      premium: sureValue - expectedAlternativeValue,
      relativePremium:
        referenceValue !== 0
          ? (sureValue - expectedAlternativeValue) / referenceValue
          : 0,
      relativeDefined: referenceValue !== 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sureValue: 55, expectedAlternativeValue: 50, referenceValue: 100 },
  output: { premium: 5, relativePremium: 0.05, relativeDefined: true },
} satisfies ToolExample<Input, Output>;
export const sureOptionPremiumTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "behavioral-economics/sure-option-premium",
    title: "Sure Option Premium Tool",
    description:
      "Compare supplied sure and expected alternative values under an explicit normalization base.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sureValue: { type: "number" },
        expectedAlternativeValue: { type: "number" },
        referenceValue: { type: "number" },
      },
      required: ["sureValue", "expectedAlternativeValue", "referenceValue"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        premium: { type: "number" },
        relativePremium: { type: "number" },
        relativeDefined: { type: "boolean" },
      },
      required: ["premium", "relativePremium", "relativeDefined"],
    },
    ports: {
      inputs: [
        {
          id: "sureValue",
          label: "Sure Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "expectedAlternativeValue",
          label: "Expected Alternative Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceValue",
          label: "Reference Value",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "premium", label: "Premium", valueType: { type: "number" } },
        {
          id: "relativePremium",
          label: "Relative Premium",
          valueType: { type: "number" },
        },
        {
          id: "relativeDefined",
          label: "Relative Defined",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = sureOptionPremiumTool.execute;
export default sureOptionPremiumTool;
