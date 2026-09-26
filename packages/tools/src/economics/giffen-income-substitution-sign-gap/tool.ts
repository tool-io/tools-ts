import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly substitutionEffect: number;
  readonly incomeEffect: number;
};
export type Output = {
  readonly totalPriceDerivative: number;
  readonly giffenSign: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    substitutionEffect: { type: "number", maximum: 0 },
    incomeEffect: { type: "number" },
  },
  required: ["substitutionEffect", "incomeEffect"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalPriceDerivative: { type: "number" },
    giffenSign: { type: "boolean" },
  },
  required: ["totalPriceDerivative", "giffenSign"],
} as const;
/** Calculate giffen income substitution sign gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { substitutionEffect, incomeEffect } = request;
  const compute = (): Output => {
    H.domain(substitutionEffect <= 0);
    return {
      totalPriceDerivative: substitutionEffect + incomeEffect,
      giffenSign: substitutionEffect + incomeEffect > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { substitutionEffect: -2, incomeEffect: 3 },
  output: { totalPriceDerivative: 1, giffenSign: true },
} satisfies ToolExample<Input, Output>;
export const giffenIncomeSubstitutionSignGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "economics/giffen-income-substitution-sign-gap",
    title: "Giffen Income Substitution Sign Gap Tool",
    description:
      "Calculate giffen income substitution sign gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        substitutionEffect: { type: "number", maximum: 0 },
        incomeEffect: { type: "number" },
      },
      required: ["substitutionEffect", "incomeEffect"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalPriceDerivative: { type: "number" },
        giffenSign: { type: "boolean" },
      },
      required: ["totalPriceDerivative", "giffenSign"],
    },
    ports: {
      inputs: [
        {
          id: "substitutionEffect",
          label: "Substitution Effect",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "incomeEffect",
          label: "Income Effect",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "totalPriceDerivative",
          label: "Total Price Derivative",
          valueType: { type: "number" },
        },
        {
          id: "giffenSign",
          label: "Giffen Sign",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = giffenIncomeSubstitutionSignGapTool.execute;
export default giffenIncomeSubstitutionSignGapTool;
