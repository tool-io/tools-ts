import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly integerDecimal: string };
export type Output = {
  readonly sign: string;
  readonly magnitudeDecimal: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    integerDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
  },
  required: ["integerDecimal"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sign: { type: "string", maxLength: 8192 },
    magnitudeDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
  },
  required: ["sign", "magnitudeDecimal"],
} as const;
/** Normalize the sign and magnitude of an exact signed decimal integer, including signed or padded zero. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { integerDecimal } = request;
  const compute = (): Output => {
    const n = H.decimal(integerDecimal);
    return {
      sign: n < 0n ? "negative" : n > 0n ? "positive" : "zero",
      magnitudeDecimal: (n < 0n ? -n : n).toString(),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { integerDecimal: "-0042" },
  output: { sign: "negative", magnitudeDecimal: "42" },
} satisfies ToolExample<Input, Output>;
export const integerCanonicalSignTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "number/integer-canonical-sign-token",
    title: "Integer Canonical Sign Token Tool",
    description:
      "Normalize the sign and magnitude of an exact signed decimal integer, including signed or padded zero.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        integerDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
      },
      required: ["integerDecimal"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sign: { type: "string", maxLength: 8192 },
        magnitudeDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
      },
      required: ["sign", "magnitudeDecimal"],
    },
    ports: {
      inputs: [
        {
          id: "integerDecimal",
          label: "Integer Decimal",
          required: true,
          valueType: { type: "string", format: "integer-decimal" },
        },
      ],
      outputs: [
        { id: "sign", label: "Sign", valueType: { type: "string" } },
        {
          id: "magnitudeDecimal",
          label: "Magnitude Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
      ],
    },
  },
  calculate,
});
export const run = integerCanonicalSignTokenTool.execute;
export default integerCanonicalSignTokenTool;
