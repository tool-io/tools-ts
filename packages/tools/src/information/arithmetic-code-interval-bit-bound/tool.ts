import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly width: number };
export type Output = {
  readonly idealBits: number;
  readonly sufficientBits: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { width: { type: "number", exclusiveMinimum: 0, maximum: 1 } },
  required: ["width"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    idealBits: { type: "number" },
    sufficientBits: { type: "integer" },
  },
  required: ["idealBits", "sufficientBits"],
} as const;
/** Return information width and a conservative dyadic coding bit bound; endpoint convention can permit fewer bits. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { width } = request;
  const compute = (): Output => {
    H.domain(width > 0 && width <= 1);
    const idealBits = -Math.log2(width);
    return { idealBits, sufficientBits: Math.ceil(idealBits) + 1 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { width: 0.125 },
  output: { idealBits: 3, sufficientBits: 4 },
} satisfies ToolExample<Input, Output>;
export const arithmeticCodeIntervalBitBoundTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "information/arithmetic-code-interval-bit-bound",
    title: "Arithmetic Code Interval Bit Bound Tool",
    description:
      "Return information width and a conservative dyadic coding bit bound; endpoint convention can permit fewer bits.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        width: { type: "number", exclusiveMinimum: 0, maximum: 1 },
      },
      required: ["width"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        idealBits: { type: "number" },
        sufficientBits: { type: "integer" },
      },
      required: ["idealBits", "sufficientBits"],
    },
    ports: {
      inputs: [
        {
          id: "width",
          label: "Width",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "idealBits", label: "Ideal Bits", valueType: { type: "number" } },
        {
          id: "sufficientBits",
          label: "Sufficient Bits",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = arithmeticCodeIntervalBitBoundTool.execute;
export default arithmeticCodeIntervalBitBoundTool;
