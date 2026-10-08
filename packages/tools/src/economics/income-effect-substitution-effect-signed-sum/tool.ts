import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly suppliedIncomeEffect: number;
  readonly suppliedSubstitutionEffect: number;
};
export type Output = { readonly totalSignedEffect: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    suppliedIncomeEffect: { type: "number" },
    suppliedSubstitutionEffect: { type: "number" },
  },
  required: ["suppliedIncomeEffect", "suppliedSubstitutionEffect"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { totalSignedEffect: { type: "number" } },
  required: ["totalSignedEffect"],
} as const;
/** Sum explicitly supplied compatible signed income and substitution effects without estimating demand responses. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { suppliedIncomeEffect, suppliedSubstitutionEffect } = request;
  const compute = (): Output => {
    return {
      totalSignedEffect: suppliedIncomeEffect + suppliedSubstitutionEffect,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { suppliedIncomeEffect: 3, suppliedSubstitutionEffect: -5 },
  output: { totalSignedEffect: -2 },
} satisfies ToolExample<Input, Output>;
export const incomeEffectSubstitutionEffectSignedSumTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: ["economics"],
        keywords: ["economics"],
      },
      id: "economics/income-effect-substitution-effect-signed-sum",
      title: "Income Effect Substitution Effect Signed Sum",
      description:
        "Sum explicitly supplied compatible signed income and substitution effects without estimating demand responses.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          suppliedIncomeEffect: { type: "number" },
          suppliedSubstitutionEffect: { type: "number" },
        },
        required: ["suppliedIncomeEffect", "suppliedSubstitutionEffect"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { totalSignedEffect: { type: "number" } },
        required: ["totalSignedEffect"],
      },
      ports: {
        inputs: [
          {
            id: "suppliedIncomeEffect",
            label: "Supplied Income Effect",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedSubstitutionEffect",
            label: "Supplied Substitution Effect",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "totalSignedEffect",
            label: "Total Signed Effect",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = incomeEffectSubstitutionEffectSignedSumTool.execute;
export default incomeEffectSubstitutionEffectSignedSumTool;
