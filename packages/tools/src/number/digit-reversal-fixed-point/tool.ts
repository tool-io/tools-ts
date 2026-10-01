import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly digits: string; readonly base: number };
export type Output = {
  readonly reversed: string;
  readonly fixedPoint: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    digits: { type: "string", maxLength: 8192 },
    base: { type: "integer", minimum: 2, maximum: 36 },
  },
  required: ["digits", "base"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reversed: { type: "string", maxLength: 8192 },
    fixedPoint: { type: "boolean" },
  },
  required: ["reversed", "fixedPoint"],
} as const;
/** Compare a fixed-width uppercase digit string to its reversal, preserving leading zeroes. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { digits, base } = request;
  const compute = (): Output => {
    H.integer(base, 2, 36);
    H.domain(
      /^[0-9A-Z]+(?![\s\S])/.test(digits) &&
        [...digits].every((c) => parseInt(c, 36) < base),
      "digits",
    );
    const reversed = [...digits].reverse().join("");
    return { reversed, fixedPoint: digits === reversed };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { digits: "12021", base: 10 },
  output: { reversed: "12021", fixedPoint: true },
} satisfies ToolExample<Input, Output>;
export const digitReversalFixedPointTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "number/digit-reversal-fixed-point",
    title: "Digit Reversal Fixed Point Tool",
    description:
      "Compare a fixed-width uppercase digit string to its reversal, preserving leading zeroes.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        digits: { type: "string", maxLength: 8192 },
        base: { type: "integer", minimum: 2, maximum: 36 },
      },
      required: ["digits", "base"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reversed: { type: "string", maxLength: 8192 },
        fixedPoint: { type: "boolean" },
      },
      required: ["reversed", "fixedPoint"],
    },
    ports: {
      inputs: [
        {
          id: "digits",
          label: "Digits",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "base",
          label: "Base",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "reversed", label: "Reversed", valueType: { type: "string" } },
        {
          id: "fixedPoint",
          label: "Fixed Point",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = digitReversalFixedPointTool.execute;
export default digitReversalFixedPointTool;
