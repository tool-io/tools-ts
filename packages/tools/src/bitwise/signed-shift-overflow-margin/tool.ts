import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly value: number;
  readonly shift: number;
  readonly width: number;
};
export type Output = {
  readonly shiftedDecimal: string;
  readonly marginDecimal: string;
  readonly fits: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "integer" },
    shift: { type: "integer", minimum: 0, maximum: 53 },
    width: { type: "integer", minimum: 1, maximum: 53 },
  },
  required: ["value", "shift", "width"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shiftedDecimal: { type: "string", maxLength: 8192 },
    marginDecimal: { type: "string", maxLength: 8192 },
    fits: { type: "boolean" },
  },
  required: ["shiftedDecimal", "marginDecimal", "fits"],
} as const;
/** Shift one signed fixed-width integer exactly and report signed distance to the boundary on the result’s side. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, shift, width } = request;
  const compute = (): Output => {
    H.integer(width, 1, 53);
    H.integer(shift, 0, 53);
    const lower = -(2n ** BigInt(width - 1)),
      upper = 2n ** BigInt(width - 1) - 1n;
    H.domain(BigInt(value) >= lower && BigInt(value) <= upper);
    const x = BigInt(value) << BigInt(shift),
      margin = x >= 0n ? upper - x : x - lower;
    return {
      shiftedDecimal: x.toString(),
      marginDecimal: margin.toString(),
      fits: margin >= 0n,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { value: 30, shift: 2, width: 8 },
  output: { shiftedDecimal: "120", marginDecimal: "7", fits: true },
} satisfies ToolExample<Input, Output>;
export const signedShiftOverflowMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bitwise/signed-shift-overflow-margin",
    title: "Signed Shift Overflow Margin Tool",
    description:
      "Shift one signed fixed-width integer exactly and report signed distance to the boundary on the result’s side.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "integer" },
        shift: { type: "integer", minimum: 0, maximum: 53 },
        width: { type: "integer", minimum: 1, maximum: 53 },
      },
      required: ["value", "shift", "width"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        shiftedDecimal: { type: "string", maxLength: 8192 },
        marginDecimal: { type: "string", maxLength: 8192 },
        fits: { type: "boolean" },
      },
      required: ["shiftedDecimal", "marginDecimal", "fits"],
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
          id: "shift",
          label: "Shift",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "width",
          label: "Width",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "shiftedDecimal",
          label: "Shifted Decimal",
          valueType: { type: "string" },
        },
        {
          id: "marginDecimal",
          label: "Margin Decimal",
          valueType: { type: "string" },
        },
        { id: "fits", label: "Fits", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = signedShiftOverflowMarginTool.execute;
export default signedShiftOverflowMarginTool;
