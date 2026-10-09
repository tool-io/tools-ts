import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly resultId: string;
  readonly mantissaText: string;
  readonly exponentText: string;
  readonly suppliedUnit: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    resultId: { type: "string", maxLength: 8192, minLength: 1 },
    mantissaText: { type: "string", maxLength: 8192, minLength: 1 },
    exponentText: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedUnit: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["resultId", "mantissaText", "exponentText", "suppliedUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit cell-count mantissa, decimal exponent and unit transcriptions without coercing or converting values. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { resultId, mantissaText, exponentText, suppliedUnit } = request;
  const compute = (): Output => {
    H.domain(resultId.length > 0, "resultId");
    H.domain(mantissaText.length > 0, "mantissaText");
    H.domain(exponentText.length > 0, "exponentText");
    H.domain(suppliedUnit.length > 0, "suppliedUnit");
    return {
      token: JSON.stringify([
        resultId,
        mantissaText,
        exponentText,
        suppliedUnit,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    resultId: "R17",
    mantissaText: "4.5",
    exponentText: "9",
    suppliedUnit: "per liter",
  },
  output: { token: '["R17","4.5","9","per liter"]' },
} satisfies ToolExample<Input, Output>;
export const cellcountDecimalExponentUnitPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hematology/cellcount-decimal-exponent-unit-pair",
    title: "Cellcount Decimal Exponent Unit Pair Tool",
    description:
      "Preserve explicit cell-count mantissa, decimal exponent and unit transcriptions without coercing or converting values.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        resultId: { type: "string", maxLength: 8192, minLength: 1 },
        mantissaText: { type: "string", maxLength: 8192, minLength: 1 },
        exponentText: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedUnit: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["resultId", "mantissaText", "exponentText", "suppliedUnit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "resultId",
          label: "Result Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "mantissaText",
          label: "Mantissa Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "exponentText",
          label: "Exponent Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedUnit",
          label: "Supplied Unit",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = cellcountDecimalExponentUnitPairTool.execute;
export default cellcountDecimalExponentUnitPairTool;
