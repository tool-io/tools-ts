import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly leading: number; readonly denominator: number };
export type Output = { readonly divides: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leading: { type: "integer" },
    denominator: { type: "integer", minimum: 1 },
  },
  required: ["leading", "denominator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { divides: { type: "boolean" } },
  required: ["divides"],
} as const;
/** Calculate rational root denominator divisibility from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { leading, denominator } = input;
  const compute = (): Output => {
    H.domain(leading !== 0);
    H.integer(denominator, 1);
    return { divides: leading % denominator === 0 };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { leading: 12, denominator: 3 },
  output: { divides: true },
} satisfies ToolExample<Input, Output>;
export const rationalRootDenominatorDivisibilityTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "algebra/rational-root-denominator-divisibility",
      title: "Rational Root Denominator Divisibility Tool",
      description:
        "Calculate rational root denominator divisibility from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          leading: { type: "integer" },
          denominator: { type: "integer", minimum: 1 },
        },
        required: ["leading", "denominator"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { divides: { type: "boolean" } },
        required: ["divides"],
      },
      ports: {
        inputs: [
          {
            id: "leading",
            label: "Leading",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "denominator",
            label: "Denominator",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          { id: "divides", label: "Divides", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = rationalRootDenominatorDivisibilityTool.execute;
export default rationalRootDenominatorDivisibilityTool;
