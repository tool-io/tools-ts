import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstNumerator: string;
  readonly firstDenominator: string;
  readonly secondNumerator: string;
  readonly secondDenominator: string;
};
export type Output = { readonly order: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstNumerator: { type: "string", maxLength: 8192 },
    firstDenominator: { type: "string", maxLength: 8192 },
    secondNumerator: { type: "string", maxLength: 8192 },
    secondDenominator: { type: "string", maxLength: 8192 },
  },
  required: [
    "firstNumerator",
    "firstDenominator",
    "secondNumerator",
    "secondDenominator",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { order: { type: "integer" } },
  required: ["order"],
} as const;
/** Calculate rational signed denominator crossproduct order from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    firstNumerator,
    firstDenominator,
    secondNumerator,
    secondDenominator,
  } = request;
  const compute = (): Output => {
    const a = H.decimal(firstNumerator),
      b = H.decimal(firstDenominator),
      c = H.decimal(secondNumerator),
      d = H.decimal(secondDenominator);
    H.domain(b !== 0n && d !== 0n);
    const left = a * d,
      right = c * b,
      raw = left < right ? -1 : left > right ? 1 : 0;
    return { order: b < 0n !== d < 0n ? -raw : raw };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstNumerator: "1",
    firstDenominator: "-2",
    secondNumerator: "1",
    secondDenominator: "3",
  },
  output: { order: -1 },
} satisfies ToolExample<Input, Output>;
export const rationalSignedDenominatorCrossproductOrderTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "number/rational-signed-denominator-crossproduct-order",
      title: "Rational Signed Denominator Crossproduct Order Tool",
      description:
        "Calculate rational signed denominator crossproduct order from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstNumerator: { type: "string", maxLength: 8192 },
          firstDenominator: { type: "string", maxLength: 8192 },
          secondNumerator: { type: "string", maxLength: 8192 },
          secondDenominator: { type: "string", maxLength: 8192 },
        },
        required: [
          "firstNumerator",
          "firstDenominator",
          "secondNumerator",
          "secondDenominator",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { order: { type: "integer" } },
        required: ["order"],
      },
      ports: {
        inputs: [
          {
            id: "firstNumerator",
            label: "First Numerator",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "firstDenominator",
            label: "First Denominator",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "secondNumerator",
            label: "Second Numerator",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "secondDenominator",
            label: "Second Denominator",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "order", label: "Order", valueType: { type: "integer" } },
        ],
      },
    },
    calculate,
  });
export const run = rationalSignedDenominatorCrossproductOrderTool.execute;
export default rationalSignedDenominatorCrossproductOrderTool;
