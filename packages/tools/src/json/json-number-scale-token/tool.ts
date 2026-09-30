import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly token: string };
export type Output = {
  readonly fractionDigits: number;
  readonly exponent: number;
  readonly decimalScale: number;
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
    fractionDigits: { type: "integer" },
    exponent: { type: "integer" },
    decimalScale: { type: "integer" },
  },
  required: ["fractionDigits", "exponent", "decimalScale"],
} as const;
/** Inspect the exact decimal scale of a valid JSON number token without rounding through Number. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token } = request;
  const compute = (): Output => {
    const a = /^-?(?:0|[1-9]\d*)(?:\.(\d+))?(?:[eE]([+-]?\d+))?(?![\s\S])/.exec(
      token,
    );
    H.domain(a, "token");
    const exponent = Number(a[2] ?? 0);
    H.integer(exponent, -Number.MAX_SAFE_INTEGER);
    const fractionDigits = (a[1] ?? "").length;
    return {
      fractionDigits,
      exponent,
      decimalScale: fractionDigits - exponent,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "1.230e2" },
  output: { fractionDigits: 3, exponent: 2, decimalScale: 1 },
} satisfies ToolExample<Input, Output>;
export const jsonNumberScaleTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "json/json-number-scale-token",
    title: "JSON Number Scale Token Tool",
    description:
      "Inspect the exact decimal scale of a valid JSON number token without rounding through Number.",
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
        fractionDigits: { type: "integer" },
        exponent: { type: "integer" },
        decimalScale: { type: "integer" },
      },
      required: ["fractionDigits", "exponent", "decimalScale"],
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
          id: "decimalScale",
          label: "Decimal Scale",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = jsonNumberScaleTokenTool.execute;
export default jsonNumberScaleTokenTool;
