import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly delimiter: string };
export type Output = { readonly kind: string; readonly codePoint: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { delimiter: { type: "string", maxLength: 8192 } },
  required: ["delimiter"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    kind: { type: "string", maxLength: 8192 },
    codePoint: { type: "integer" },
  },
  required: ["kind", "codePoint"],
} as const;
/** Identify the literal Unicode Arabic decimal/thousands separator characters without guessing a locale-specific numeric parse. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { delimiter } = request;
  const compute = (): Output => {
    H.domain([...delimiter].length === 1);
    const codePoint = delimiter.codePointAt(0);
    H.domain(codePoint !== undefined);
    return {
      kind:
        codePoint === 1643
          ? "arabic-decimal"
          : codePoint === 1644
            ? "arabic-thousands"
            : codePoint === 46
              ? "ascii-period"
              : codePoint === 44
                ? "ascii-comma"
                : "other",
      codePoint,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { delimiter: "٫" },
  output: { kind: "arabic-decimal", codePoint: 1643 },
} satisfies ToolExample<Input, Output>;
export const arabicDigitDelimiterKindTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "middle-eastern-studies/arabic-digit-delimiter-kind",
    title: "Arabic Digit Delimiter Kind Tool",
    description:
      "Identify the literal Unicode Arabic decimal/thousands separator characters without guessing a locale-specific numeric parse.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { delimiter: { type: "string", maxLength: 8192 } },
      required: ["delimiter"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        kind: { type: "string", maxLength: 8192 },
        codePoint: { type: "integer" },
      },
      required: ["kind", "codePoint"],
    },
    ports: {
      inputs: [
        {
          id: "delimiter",
          label: "Delimiter",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "kind", label: "Kind", valueType: { type: "string" } },
        {
          id: "codePoint",
          label: "Code Point",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = arabicDigitDelimiterKindTool.execute;
export default arabicDigitDelimiterKindTool;
