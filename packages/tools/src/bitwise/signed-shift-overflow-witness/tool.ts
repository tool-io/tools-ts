import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly value: number;
  readonly width: number;
  readonly shift: number;
};
export type Output = {
  readonly exactDecimal: string;
  readonly wraps: boolean;
  readonly wrapped: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "integer" },
    width: { type: "integer", minimum: 1, maximum: 53 },
    shift: { type: "integer", minimum: 0, maximum: 8192 },
  },
  required: ["value", "width", "shift"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exactDecimal: { type: "string", maxLength: 8192 },
    wraps: { type: "boolean" },
    wrapped: { type: "integer" },
  },
  required: ["exactDecimal", "wraps", "wrapped"],
} as const;
/** Exact signed left-shift witness using an explicit two-complement width. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, width, shift } = request;
  const compute = (): Output => {
    H.integer(width, 1, 53);
    H.integer(shift, 0, 8192);
    const v = BigInt(value),
      min = -(1n << BigInt(width - 1)),
      max = (1n << BigInt(width - 1)) - 1n;
    H.domain(v >= min && v <= max);
    const exact = v << BigInt(shift);
    return {
      exactDecimal: exact.toString(),
      wraps: exact < min || exact > max,
      wrapped: Number(BigInt.asIntN(width, exact)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { value: 60, width: 8, shift: 2 },
  output: { exactDecimal: "240", wraps: true, wrapped: -16 },
} satisfies ToolExample<Input, Output>;
export const signedShiftOverflowWitnessTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bitwise/signed-shift-overflow-witness",
    title: "Signed Shift Overflow Witness Tool",
    description:
      "Exact signed left-shift witness using an explicit two-complement width.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "integer" },
        width: { type: "integer", minimum: 1, maximum: 53 },
        shift: { type: "integer", minimum: 0, maximum: 8192 },
      },
      required: ["value", "width", "shift"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        exactDecimal: { type: "string", maxLength: 8192 },
        wraps: { type: "boolean" },
        wrapped: { type: "integer" },
      },
      required: ["exactDecimal", "wraps", "wrapped"],
    },
    ports: {
      inputs: [
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "width",
          label: "Width",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "shift",
          label: "Shift",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "exactDecimal",
          label: "Exact Decimal",
          valueType: { type: "string" },
        },
        { id: "wraps", label: "Wraps", valueType: { type: "boolean" } },
        { id: "wrapped", label: "Wrapped", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = signedShiftOverflowWitnessTool.execute;
export default signedShiftOverflowWitnessTool;
