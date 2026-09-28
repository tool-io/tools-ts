import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly token: string };
export type Output = {
  readonly fractionDigits: number;
  readonly exponent: number;
  readonly lexicalScale: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 16, minLength: 1 } },
  required: ["token"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fractionDigits: { type: "integer" },
    exponent: { type: "integer" },
    lexicalScale: { type: "integer" },
  },
  required: ["fractionDigits", "exponent", "lexicalScale"],
} as const;
/** Inspect the lexical decimal scale of one DICOM DS token with ASCII-space padding and the 16-byte limit, without evaluating its numeric magnitude. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token } = request;
  const compute = (): Output => {
    H.domain(token.length <= 16, "token");
    const t = token.replace(/^ +| +$/g, ""),
      match =
        /^[+-]?(?:\d+(?:\.(\d*))?|\.(\d+))(?:[eE]([+-]?\d+))?(?![\s\S])/.exec(
          t,
        );
    H.domain(match !== null, "token");
    const fractionDigits = (match[1] ?? match[2] ?? "").length,
      exponent = Number(match[3] ?? "0");
    H.integer(exponent, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
    return {
      fractionDigits,
      exponent,
      lexicalScale: fractionDigits - exponent,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: " 1.20E+2" },
  output: { fractionDigits: 2, exponent: 2, lexicalScale: 0 },
} satisfies ToolExample<Input, Output>;
export const dicomDecimalStringScaleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-informatics/dicom-decimal-string-scale",
    title: "DICOM Decimal String Scale Tool",
    description:
      "Inspect the lexical decimal scale of one DICOM DS token with ASCII-space padding and the 16-byte limit, without evaluating its numeric magnitude.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 16, minLength: 1 } },
      required: ["token"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fractionDigits: { type: "integer" },
        exponent: { type: "integer" },
        lexicalScale: { type: "integer" },
      },
      required: ["fractionDigits", "exponent", "lexicalScale"],
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
        {
          id: "fractionDigits",
          label: "Fraction Digits",
          valueType: { type: "integer" },
        },
        { id: "exponent", label: "Exponent", valueType: { type: "integer" } },
        {
          id: "lexicalScale",
          label: "Lexical Scale",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = dicomDecimalStringScaleTool.execute;
export default dicomDecimalStringScaleTool;
