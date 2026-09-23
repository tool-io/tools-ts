import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly charge: number;
  readonly sourceBasis: number;
  readonly targetBasis: number;
};
export type Output = { readonly convertedCharge: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    charge: { type: "number" },
    sourceBasis: { type: "number", exclusiveMinimum: 0 },
    targetBasis: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["charge", "sourceBasis", "targetBasis"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { convertedCharge: { type: "number" } },
  required: ["convertedCharge"],
} as const;
/** Rescale a supplied charge to an explicit reporting denominator. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { charge, sourceBasis, targetBasis } = request;
  const compute = (): Output => {
    H.positive(sourceBasis);
    H.positive(targetBasis);
    return { convertedCharge: (charge / sourceBasis) * targetBasis };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { charge: 20, sourceBasis: 100, targetBasis: 1000 },
  output: { convertedCharge: 200 },
} satisfies ToolExample<Input, Output>;
export const chargebackRateBasisFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "business-administration/chargeback-rate-basis-factor",
    title: "Chargeback Rate Basis Factor Tool",
    description:
      "Rescale a supplied charge to an explicit reporting denominator.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        charge: { type: "number" },
        sourceBasis: { type: "number", exclusiveMinimum: 0 },
        targetBasis: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["charge", "sourceBasis", "targetBasis"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { convertedCharge: { type: "number" } },
      required: ["convertedCharge"],
    },
    ports: {
      inputs: [
        {
          id: "charge",
          label: "Charge",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sourceBasis",
          label: "Source Basis",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetBasis",
          label: "Target Basis",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "convertedCharge",
          label: "Converted Charge",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = chargebackRateBasisFactorTool.execute;
export default chargebackRateBasisFactorTool;
