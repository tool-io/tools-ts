import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstExponent: number;
  readonly secondExponent: number;
};
export type Output = { readonly gap: number; readonly ratio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstExponent: { type: "integer", minimum: -500, maximum: 500 },
    secondExponent: { type: "integer", minimum: -500, maximum: 500 },
  },
  required: ["firstExponent", "secondExponent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gap: { type: "integer" }, ratio: { type: "number" } },
  required: ["gap", "ratio"],
} as const;
/** Calculate binary radix exponent gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstExponent, secondExponent } = request;
  const compute = (): Output => {
    H.integer(firstExponent, -500, 500);
    H.integer(secondExponent, -500, 500);
    return {
      gap: firstExponent - secondExponent,
      ratio: 2 ** (firstExponent - secondExponent),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstExponent: 5, secondExponent: 2 },
  output: { gap: 3, ratio: 8 },
} satisfies ToolExample<Input, Output>;
export const binaryRadixExponentGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "number/binary-radix-exponent-gap",
    title: "Binary Radix Exponent Gap Tool",
    description:
      "Calculate binary radix exponent gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstExponent: { type: "integer", minimum: -500, maximum: 500 },
        secondExponent: { type: "integer", minimum: -500, maximum: 500 },
      },
      required: ["firstExponent", "secondExponent"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { gap: { type: "integer" }, ratio: { type: "number" } },
      required: ["gap", "ratio"],
    },
    ports: {
      inputs: [
        {
          id: "firstExponent",
          label: "First Exponent",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondExponent",
          label: "Second Exponent",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "gap", label: "Gap", valueType: { type: "integer" } },
        { id: "ratio", label: "Ratio", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = binaryRadixExponentGapTool.execute;
export default binaryRadixExponentGapTool;
