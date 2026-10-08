import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly resultText: string;
  readonly suppliedSignificantDigits: number;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    resultText: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedSignificantDigits: { type: "integer", minimum: 1 },
  },
  required: ["resultText", "suppliedSignificantDigits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label a supplied hormone result transcription with an explicitly asserted significant-digit count without rounding or inferring precision. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { resultText, suppliedSignificantDigits } = request;
  const compute = (): Output => {
    H.domain(resultText.length > 0, "resultText");
    (H.domain(
      Number.isSafeInteger(suppliedSignificantDigits) &&
        suppliedSignificantDigits >= 1 &&
        suppliedSignificantDigits <= Number.MAX_SAFE_INTEGER,
      "suppliedSignificantDigits",
    ),
      suppliedSignificantDigits);
    return {
      label:
        resultText + " [" + suppliedSignificantDigits + " significant digits]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { resultText: "12.30", suppliedSignificantDigits: 4 },
  output: { label: "12.30 [4 significant digits]" },
} satisfies ToolExample<Input, Output>;
export const hormoneResultSignificantDigitLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "endocrinology/hormone-result-significant-digit-label",
    title: "Hormone Result Significant Digit Label Tool",
    description:
      "Label a supplied hormone result transcription with an explicitly asserted significant-digit count without rounding or inferring precision.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        resultText: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedSignificantDigits: { type: "integer", minimum: 1 },
      },
      required: ["resultText", "suppliedSignificantDigits"],
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
          id: "resultText",
          label: "Result Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedSignificantDigits",
          label: "Supplied Significant Digits",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = hormoneResultSignificantDigitLabelTool.execute;
export default hormoneResultSignificantDigitLabelTool;
