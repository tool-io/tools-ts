import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly numerator: number;
  readonly denominator: number;
};
export type Output = { readonly text: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    numerator: { type: "integer" },
    denominator: { type: "integer" },
  },
  required: ["numerator", "denominator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { text: { type: "string", maxLength: 8192 } },
  required: ["text"],
} as const;
/** Calculate rational sign denominator canonical display from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { numerator, denominator } = request;
  const compute = (): Output => {
    H.domain(denominator !== 0);
    return {
      text:
        (denominator < 0 ? -numerator : numerator) +
        "/" +
        Math.abs(denominator),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { numerator: 3, denominator: -4 },
  output: { text: "-3/4" },
} satisfies ToolExample<Input, Output>;
export const rationalSignDenominatorCanonicalDisplayTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "format/rational-sign-denominator-canonical-display",
      title: "Rational Sign Denominator Canonical Display Tool",
      description:
        "Calculate rational sign denominator canonical display from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          numerator: { type: "integer" },
          denominator: { type: "integer" },
        },
        required: ["numerator", "denominator"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { text: { type: "string", maxLength: 8192 } },
        required: ["text"],
      },
      ports: {
        inputs: [
          {
            id: "numerator",
            label: "Numerator",
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
        outputs: [{ id: "text", label: "Text", valueType: { type: "string" } }],
      },
    },
    calculate,
  });
export const run = rationalSignDenominatorCanonicalDisplayTool.execute;
export default rationalSignDenominatorCanonicalDisplayTool;
