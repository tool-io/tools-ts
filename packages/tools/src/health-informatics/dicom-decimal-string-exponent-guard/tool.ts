import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly token: string };
export type Output = {
  readonly lexical: string;
  readonly value: number;
  readonly hasExponent: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lexical: { type: "string", maxLength: 8192 },
    value: { type: "number" },
    hasExponent: { type: "boolean" },
  },
  required: ["lexical", "value", "hasExponent"],
} as const;
/** Validate one DICOM DS decimal token including its 16-character budget and permitted surrounding spaces; preserve lexical form separately from the finite numeric value. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token } = request;
  const compute = (): Output => {
    H.domain(token.length > 0 && token.length <= 16);
    const lexical = token.replace(/^ +| +$/g, "");
    H.domain(
      /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[Ee][+-]?\d+)?(?![\s\S])/.test(lexical),
    );
    const value = Number(lexical);
    H.finite(value);
    return { lexical, value, hasExponent: /[Ee]/.test(lexical) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: " +1.25E-3 " },
  output: { lexical: "+1.25E-3", value: 0.00125, hasExponent: true },
} satisfies ToolExample<Input, Output>;
export const dicomDecimalStringExponentGuardTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-informatics/dicom-decimal-string-exponent-guard",
    title: "DICOM Decimal String Exponent Guard Tool",
    description:
      "Validate one DICOM DS decimal token including its 16-character budget and permitted surrounding spaces; preserve lexical form separately from the finite numeric value.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lexical: { type: "string", maxLength: 8192 },
        value: { type: "number" },
        hasExponent: { type: "boolean" },
      },
      required: ["lexical", "value", "hasExponent"],
    },
    ports: {
      inputs: [
        {
          id: "token",
          label: "Token",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "lexical", label: "Lexical", valueType: { type: "string" } },
        { id: "value", label: "Value", valueType: { type: "number" } },
        {
          id: "hasExponent",
          label: "Has Exponent",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = dicomDecimalStringExponentGuardTool.execute;
export default dicomDecimalStringExponentGuardTool;
