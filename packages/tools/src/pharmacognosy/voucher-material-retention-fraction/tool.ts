import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly retainedMass: number;
  readonly originalMass: number;
};
export type Output = { readonly fraction: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    retainedMass: { type: "number", minimum: 0 },
    originalMass: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["retainedMass", "originalMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fraction: { type: "number" } },
  required: ["fraction"],
} as const;
/** Calculate voucher material retention fraction from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { retainedMass, originalMass } = request;
  const compute = (): Output => {
    H.positive(originalMass);
    H.domain(retainedMass >= 0 && retainedMass <= originalMass);
    return { fraction: retainedMass / originalMass };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { retainedMass: 3, originalMass: 12 },
  output: { fraction: 0.25 },
} satisfies ToolExample<Input, Output>;
export const voucherMaterialRetentionFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacognosy/voucher-material-retention-fraction",
    title: "Voucher Material Retention Fraction Tool",
    description:
      "Calculate voucher material retention fraction from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        retainedMass: { type: "number", minimum: 0 },
        originalMass: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["retainedMass", "originalMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { fraction: { type: "number" } },
      required: ["fraction"],
    },
    ports: {
      inputs: [
        {
          id: "retainedMass",
          label: "Retained Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "originalMass",
          label: "Original Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = voucherMaterialRetentionFractionTool.execute;
export default voucherMaterialRetentionFractionTool;
