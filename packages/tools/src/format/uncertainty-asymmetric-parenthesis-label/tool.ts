import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly valueText: string;
  readonly lowerUncertaintyText: string;
  readonly upperUncertaintyText: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    valueText: { type: "string", maxLength: 8192, minLength: 1 },
    lowerUncertaintyText: { type: "string", maxLength: 8192 },
    upperUncertaintyText: { type: "string", maxLength: 8192 },
  },
  required: ["valueText", "lowerUncertaintyText", "upperUncertaintyText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Format supplied value text with explicit nonnegative lower and upper uncertainty text without rounding or interpreting confidence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { valueText, lowerUncertaintyText, upperUncertaintyText } = request;
  const compute = (): Output => {
    H.domain(valueText.length > 0, "valueText");
    H.domain(
      /^(?:0|[1-9][0-9]*)(?:[.][0-9]+)?(?![\s\S])/.test(lowerUncertaintyText),
      "lowerUncertaintyText",
    );
    H.domain(
      /^(?:0|[1-9][0-9]*)(?:[.][0-9]+)?(?![\s\S])/.test(upperUncertaintyText),
      "upperUncertaintyText",
    );
    return {
      label:
        valueText +
        " (−" +
        lowerUncertaintyText +
        ", +" +
        upperUncertaintyText +
        ")",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    valueText: "12.50",
    lowerUncertaintyText: "0.20",
    upperUncertaintyText: "0.35",
  },
  output: { label: "12.50 (−0.20, +0.35)" },
} satisfies ToolExample<Input, Output>;
export const uncertaintyAsymmetricParenthesisLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["encode-decode"],
        fields: ["format", "data formatting", "computer science"],
        keywords: ["data formatting", "computer science"],
      },
      id: "format/uncertainty-asymmetric-parenthesis-label",
      title: "Asymmetric Uncertainty Parenthesis Label",
      description:
        "Format supplied value text with explicit nonnegative lower and upper uncertainty text without rounding or interpreting confidence.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          valueText: { type: "string", maxLength: 8192, minLength: 1 },
          lowerUncertaintyText: { type: "string", maxLength: 8192 },
          upperUncertaintyText: { type: "string", maxLength: 8192 },
        },
        required: ["valueText", "lowerUncertaintyText", "upperUncertaintyText"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { label: { type: "string", maxLength: 8192 } },
        required: ["label"],
      },
      ports: {
        inputs: [
          {
            id: "valueText",
            label: "Value Text",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "lowerUncertaintyText",
            label: "Lower Uncertainty Text",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "upperUncertaintyText",
            label: "Upper Uncertainty Text",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "label", label: "Label", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = uncertaintyAsymmetricParenthesisLabelTool.execute;
export default uncertaintyAsymmetricParenthesisLabelTool;
