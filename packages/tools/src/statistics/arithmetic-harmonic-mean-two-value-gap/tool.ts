import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly first: number; readonly second: number };
export type Output = {
  readonly arithmetic: number;
  readonly harmonic: number;
  readonly gap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "number", exclusiveMinimum: 0 },
    second: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["first", "second"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    arithmetic: { type: "number" },
    harmonic: { type: "number" },
    gap: { type: "number" },
  },
  required: ["arithmetic", "harmonic", "gap"],
} as const;
/** Calculate arithmetic harmonic mean two value gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { first, second } = request;
  const compute = (): Output => {
    H.positive(first);
    H.positive(second);
    const arithmetic = first / 2 + second / 2,
      harmonic = (2 * first * second) / (first + second);
    return { arithmetic, harmonic, gap: arithmetic - harmonic };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { first: 2, second: 8 },
  output: { arithmetic: 5, harmonic: 3.2, gap: 1.7999999999999998 },
} satisfies ToolExample<Input, Output>;
export const arithmeticHarmonicMeanTwoValueGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "statistics/arithmetic-harmonic-mean-two-value-gap",
    title: "Arithmetic Harmonic Mean Two Value Gap Tool",
    description:
      "Calculate arithmetic harmonic mean two value gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        first: { type: "number", exclusiveMinimum: 0 },
        second: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["first", "second"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        arithmetic: { type: "number" },
        harmonic: { type: "number" },
        gap: { type: "number" },
      },
      required: ["arithmetic", "harmonic", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "first",
          label: "First",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "second",
          label: "Second",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "arithmetic",
          label: "Arithmetic",
          valueType: { type: "number" },
        },
        { id: "harmonic", label: "Harmonic", valueType: { type: "number" } },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = arithmeticHarmonicMeanTwoValueGapTool.execute;
export default arithmeticHarmonicMeanTwoValueGapTool;
