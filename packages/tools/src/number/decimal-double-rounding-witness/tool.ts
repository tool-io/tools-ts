import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly value: number;
  readonly firstDigits: number;
  readonly finalDigits: number;
};
export type Output = {
  readonly direct: number;
  readonly staged: number;
  readonly differs: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    firstDigits: { type: "integer", maximum: 12 },
    finalDigits: { type: "integer", minimum: 0, maximum: 10 },
  },
  required: ["value", "firstDigits", "finalDigits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    direct: { type: "number" },
    staged: { type: "number" },
    differs: { type: "boolean" },
  },
  required: ["direct", "staged", "differs"],
} as const;
/** Demonstrate explicit Math.round half-toward-positive-infinity decimal rounding; this tool intentionally compares rounding policies. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, firstDigits, finalDigits } = request;
  const compute = (): Output => {
    H.integer(finalDigits, 0, 10);
    H.integer(firstDigits, finalDigits + 1, 12);
    const round = (x: number, d: number) => Math.round(x * 10 ** d) / 10 ** d,
      direct = round(value, finalDigits),
      staged = round(round(value, firstDigits), finalDigits);
    return { direct, staged, differs: direct !== staged };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { value: 1.249, firstDigits: 2, finalDigits: 1 },
  output: { direct: 1.2, staged: 1.3, differs: true },
} satisfies ToolExample<Input, Output>;
export const decimalDoubleRoundingWitnessTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "number/decimal-double-rounding-witness",
    title: "Decimal Double Rounding Witness Tool",
    description:
      "Demonstrate explicit Math.round half-toward-positive-infinity decimal rounding; this tool intentionally compares rounding policies.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "number" },
        firstDigits: { type: "integer", maximum: 12 },
        finalDigits: { type: "integer", minimum: 0, maximum: 10 },
      },
      required: ["value", "firstDigits", "finalDigits"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        direct: { type: "number" },
        staged: { type: "number" },
        differs: { type: "boolean" },
      },
      required: ["direct", "staged", "differs"],
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
          id: "firstDigits",
          label: "First Digits",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "finalDigits",
          label: "Final Digits",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "direct", label: "Direct", valueType: { type: "number" } },
        { id: "staged", label: "Staged", valueType: { type: "number" } },
        { id: "differs", label: "Differs", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = decimalDoubleRoundingWitnessTool.execute;
export default decimalDoubleRoundingWitnessTool;
