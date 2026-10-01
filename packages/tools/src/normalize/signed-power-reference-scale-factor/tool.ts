import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  positive,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly value: number;
  readonly scale: number;
  readonly power: number;
};
export type Output = { readonly normalized: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    scale: { type: "number", exclusiveMinimum: 0 },
    power: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["value", "scale", "power"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { normalized: { type: "number" } },
  required: ["normalized"],
} as const;
/** Compute signed power reference scale factor from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { value, scale, power } = input;
  const compute = (): Output => {
    positive(scale);
    positive(power);
    return {
      normalized: Math.sign(value) * (Math.abs(value) / scale) ** power,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { value: -4, scale: 2, power: 2 },
  output: { normalized: -4 },
} satisfies ToolExample<Input, Output>;
export const signedPowerReferenceScaleFactorTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "normalize/signed-power-reference-scale-factor",
  title: "Signed Power Reference Scale Factor Tool",
  description:
    "Compute signed power reference scale factor from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "value",
        label: "Value",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "scale",
        label: "Scale",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "power",
        label: "Power",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      { id: "normalized", label: "Normalized", valueType: { type: "number" } },
    ],
  },
});
export const run = signedPowerReferenceScaleFactorTool.execute;
export default signedPowerReferenceScaleFactorTool;
