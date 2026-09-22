import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly span: number;
  readonly rise: number;
  readonly tolerance: number;
};
export type Output = {
  readonly expectedRise: number;
  readonly residual: number;
  readonly semicircular: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    span: { type: "number", exclusiveMinimum: 0 },
    rise: { type: "number", minimum: 0 },
    tolerance: { type: "number", minimum: 0 },
  },
  required: ["span", "rise", "tolerance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expectedRise: { type: "number" },
    residual: { type: "number" },
    semicircular: { type: "boolean" },
  },
  required: ["expectedRise", "residual", "semicircular"],
} as const;
/** Calculate vault semicircular rise span check from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { span, rise, tolerance } = request;
  const compute = (): Output => {
    H.positive(span);
    H.domain(rise >= 0 && tolerance >= 0);
    return {
      expectedRise: span / 2,
      residual: rise - span / 2,
      semicircular: Math.abs(rise - span / 2) <= tolerance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { span: 6, rise: 2.8, tolerance: 0.1 },
  output: {
    expectedRise: 3,
    residual: -0.20000000000000018,
    semicircular: false,
  },
} satisfies ToolExample<Input, Output>;
export const vaultSemicircularRiseSpanCheckTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "architecture/vault-semicircular-rise-span-check",
    title: "Vault Semicircular Rise Span Check Tool",
    description:
      "Calculate vault semicircular rise span check from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        span: { type: "number", exclusiveMinimum: 0 },
        rise: { type: "number", minimum: 0 },
        tolerance: { type: "number", minimum: 0 },
      },
      required: ["span", "rise", "tolerance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expectedRise: { type: "number" },
        residual: { type: "number" },
        semicircular: { type: "boolean" },
      },
      required: ["expectedRise", "residual", "semicircular"],
    },
    ports: {
      inputs: [
        {
          id: "span",
          label: "Span",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rise",
          label: "Rise",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tolerance",
          label: "Tolerance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "expectedRise",
          label: "Expected Rise",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
        {
          id: "semicircular",
          label: "Semicircular",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = vaultSemicircularRiseSpanCheckTool.execute;
export default vaultSemicircularRiseSpanCheckTool;
