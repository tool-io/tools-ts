import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly numerator: number;
  readonly denominator: number;
  readonly allowNegative: boolean;
};
export type Output = { readonly ratio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    numerator: { type: "number" },
    denominator: { type: "number" },
    allowNegative: { type: "boolean" },
  },
  required: ["numerator", "denominator", "allowNegative"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ratio: { type: "number" } },
  required: ["ratio"],
} as const;
/** Calculate proportional quantity signed denominator policy from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { numerator, denominator, allowNegative } = request;
  const compute = (): Output => {
    H.domain(denominator !== 0 && (allowNegative || denominator > 0));
    return { ratio: numerator / denominator };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { numerator: 3, denominator: -2, allowNegative: true },
  output: { ratio: -1.5 },
} satisfies ToolExample<Input, Output>;
export const proportionalQuantitySignedDenominatorPolicyTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "proportions/proportional-quantity-signed-denominator-policy",
      title: "Proportional Quantity Signed Denominator Policy Tool",
      description:
        "Calculate proportional quantity signed denominator policy from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          numerator: { type: "number" },
          denominator: { type: "number" },
          allowNegative: { type: "boolean" },
        },
        required: ["numerator", "denominator", "allowNegative"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { ratio: { type: "number" } },
        required: ["ratio"],
      },
      ports: {
        inputs: [
          {
            id: "numerator",
            label: "Numerator",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "denominator",
            label: "Denominator",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "allowNegative",
            label: "Allow Negative",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          { id: "ratio", label: "Ratio", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = proportionalQuantitySignedDenominatorPolicyTool.execute;
export default proportionalQuantitySignedDenominatorPolicyTool;
