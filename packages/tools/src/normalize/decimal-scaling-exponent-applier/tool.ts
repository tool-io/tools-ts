import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly value: number;
  readonly decimalExponent: number;
};
export type Output = { readonly scaled: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    decimalExponent: { type: "integer", minimum: -308, maximum: 308 },
  },
  required: ["value", "decimalExponent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { scaled: { type: "number" } },
  required: ["scaled"],
} as const;
/** Apply an explicit base-ten scaling exponent to one finite value; nonfinite outputs are rejected. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, decimalExponent } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(decimalExponent) &&
        decimalExponent >= -308 &&
        decimalExponent <= 308,
      "decimalExponent",
    ),
      decimalExponent);
    return { scaled: value * 10 ** decimalExponent };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { value: 12.5, decimalExponent: -2 },
  output: { scaled: 0.125 },
} satisfies ToolExample<Input, Output>;
export const decimalScalingExponentApplierTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "normalize/decimal-scaling-exponent-applier",
    title: "Decimal Scaling Exponent Applier Tool",
    description:
      "Apply an explicit base-ten scaling exponent to one finite value; nonfinite outputs are rejected.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "number" },
        decimalExponent: { type: "integer", minimum: -308, maximum: 308 },
      },
      required: ["value", "decimalExponent"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { scaled: { type: "number" } },
      required: ["scaled"],
    },
    ports: {
      inputs: [
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "decimalExponent",
          label: "Decimal Exponent",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "scaled", label: "Scaled", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = decimalScalingExponentApplierTool.execute;
export default decimalScalingExponentApplierTool;
