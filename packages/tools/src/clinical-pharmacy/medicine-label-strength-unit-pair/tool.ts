import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly amount: number;
  readonly numeratorUnit: string;
  readonly denominator: number;
  readonly denominatorUnit: string;
};
export type Output = { readonly strength: number; readonly unitPair: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    amount: { type: "number", minimum: 0 },
    numeratorUnit: { type: "string", maxLength: 8192 },
    denominator: { type: "number", exclusiveMinimum: 0 },
    denominatorUnit: { type: "string", maxLength: 8192 },
  },
  required: ["amount", "numeratorUnit", "denominator", "denominatorUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    strength: { type: "number" },
    unitPair: { type: "string", maxLength: 8192 },
  },
  required: ["strength", "unitPair"],
} as const;
/** Preserve explicit label unit bases while computing a numerical strength ratio. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { amount, numeratorUnit, denominator, denominatorUnit } = request;
  const compute = (): Output => {
    H.domain(
      amount >= 0 && numeratorUnit.length > 0 && denominatorUnit.length > 0,
    );
    H.positive(denominator);
    return {
      strength: amount / denominator,
      unitPair: JSON.stringify([numeratorUnit, denominatorUnit]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    amount: 250,
    numeratorUnit: "mg",
    denominator: 5,
    denominatorUnit: "mL",
  },
  output: { strength: 50, unitPair: '["mg","mL"]' },
} satisfies ToolExample<Input, Output>;
export const medicineLabelStrengthUnitPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "clinical-pharmacy/medicine-label-strength-unit-pair",
    title: "Medicine Label Strength Unit Pair Tool",
    description:
      "Preserve explicit label unit bases while computing a numerical strength ratio.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        amount: { type: "number", minimum: 0 },
        numeratorUnit: { type: "string", maxLength: 8192 },
        denominator: { type: "number", exclusiveMinimum: 0 },
        denominatorUnit: { type: "string", maxLength: 8192 },
      },
      required: ["amount", "numeratorUnit", "denominator", "denominatorUnit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        strength: { type: "number" },
        unitPair: { type: "string", maxLength: 8192 },
      },
      required: ["strength", "unitPair"],
    },
    ports: {
      inputs: [
        {
          id: "amount",
          label: "Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "numeratorUnit",
          label: "Numerator Unit",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "denominator",
          label: "Denominator",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "denominatorUnit",
          label: "Denominator Unit",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "strength", label: "Strength", valueType: { type: "number" } },
        { id: "unitPair", label: "Unit Pair", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = medicineLabelStrengthUnitPairTool.execute;
export default medicineLabelStrengthUnitPairTool;
