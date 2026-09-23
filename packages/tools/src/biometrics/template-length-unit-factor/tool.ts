import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly length: number; readonly bytesPerUnit: number };
export type Output = { readonly bytesDecimal: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    length: { type: "integer", minimum: 0 },
    bytesPerUnit: { type: "integer", minimum: 1 },
  },
  required: ["length", "bytesPerUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { bytesDecimal: { type: "string", maxLength: 8192 } },
  required: ["bytesDecimal"],
} as const;
/** Compute a supplied template storage length; no biometric data is generated or interpreted. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { length, bytesPerUnit } = request;
  const compute = (): Output => {
    H.integer(length, 0);
    H.integer(bytesPerUnit, 1);
    return { bytesDecimal: (BigInt(length) * BigInt(bytesPerUnit)).toString() };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { length: 128, bytesPerUnit: 4 },
  output: { bytesDecimal: "512" },
} satisfies ToolExample<Input, Output>;
export const templateLengthUnitFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biometrics/template-length-unit-factor",
    title: "Template Length Unit Factor Tool",
    description:
      "Compute a supplied template storage length; no biometric data is generated or interpreted.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        length: { type: "integer", minimum: 0 },
        bytesPerUnit: { type: "integer", minimum: 1 },
      },
      required: ["length", "bytesPerUnit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { bytesDecimal: { type: "string", maxLength: 8192 } },
      required: ["bytesDecimal"],
    },
    ports: {
      inputs: [
        {
          id: "length",
          label: "Length",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "bytesPerUnit",
          label: "Bytes Per Unit",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "bytesDecimal",
          label: "Bytes Decimal",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = templateLengthUnitFactorTool.execute;
export default templateLengthUnitFactorTool;
