import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly baseCharge: number;
  readonly exemptFraction: number;
  readonly surcharge: number;
};
export type Output = { readonly exemption: number; readonly charge: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baseCharge: { type: "number", minimum: 0 },
    exemptFraction: { type: "number", minimum: 0, maximum: 1 },
    surcharge: { type: "number", minimum: 0 },
  },
  required: ["baseCharge", "exemptFraction", "surcharge"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { exemption: { type: "number" }, charge: { type: "number" } },
  required: ["exemption", "charge"],
} as const;
/** Surcharge is added after exemption and is not itself exempted. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { baseCharge, exemptFraction, surcharge } = request;
  const compute = (): Output => {
    H.domain(baseCharge >= 0 && surcharge >= 0);
    H.probability(exemptFraction);
    return {
      exemption: baseCharge * exemptFraction,
      charge: baseCharge * (1 - exemptFraction) + surcharge,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { baseCharge: 100, exemptFraction: 0.25, surcharge: 10 },
  output: { exemption: 25, charge: 85 },
} satisfies ToolExample<Input, Output>;
export const municipalChargeExemptFractionTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-administration/municipal-charge-exempt-fraction-term",
    title: "Municipal Charge Exempt Fraction Term Tool",
    description:
      "Surcharge is added after exemption and is not itself exempted.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baseCharge: { type: "number", minimum: 0 },
        exemptFraction: { type: "number", minimum: 0, maximum: 1 },
        surcharge: { type: "number", minimum: 0 },
      },
      required: ["baseCharge", "exemptFraction", "surcharge"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { exemption: { type: "number" }, charge: { type: "number" } },
      required: ["exemption", "charge"],
    },
    ports: {
      inputs: [
        {
          id: "baseCharge",
          label: "Base Charge",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "exemptFraction",
          label: "Exempt Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "surcharge",
          label: "Surcharge",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "exemption", label: "Exemption", valueType: { type: "number" } },
        { id: "charge", label: "Charge", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = municipalChargeExemptFractionTermTool.execute;
export default municipalChargeExemptFractionTermTool;
