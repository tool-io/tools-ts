import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly numeratorDecimal: string;
  readonly denominatorDecimal: string;
};
export type Output = { readonly fraction: number; readonly exactShare: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    numeratorDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
    denominatorDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
  },
  required: ["numeratorDecimal", "denominatorDecimal"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fraction: { type: "number" },
    exactShare: { type: "string", maxLength: 8192 },
  },
  required: ["fraction", "exactShare"],
} as const;
/** Reduce a supplied nonnegative endowment-share fraction and return its numeric approximation without inferring legal entitlements. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { numeratorDecimal, denominatorDecimal } = request;
  const compute = (): Output => {
    const n = H.decimal(numeratorDecimal),
      d = H.decimal(denominatorDecimal);
    H.domain(d > 0n && n >= 0n && n <= d, "");
    let a = n,
      b = d;
    while (b !== 0n) {
      const r = a % b;
      a = b;
      b = r;
    }
    return {
      fraction: Number(n) / Number(d),
      exactShare: (n / a).toString() + "/" + (d / a).toString(),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { numeratorDecimal: "3", denominatorDecimal: "12" },
  output: { fraction: 0.25, exactShare: "1/4" },
} satisfies ToolExample<Input, Output>;
export const middleEasternWakfShareFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "middle-eastern-studies/middle-eastern-wakf-share-fraction",
    title: "Middle Eastern Wakf Share Fraction Tool",
    description:
      "Reduce a supplied nonnegative endowment-share fraction and return its numeric approximation without inferring legal entitlements.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        numeratorDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
        denominatorDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
      },
      required: ["numeratorDecimal", "denominatorDecimal"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fraction: { type: "number" },
        exactShare: { type: "string", maxLength: 8192 },
      },
      required: ["fraction", "exactShare"],
    },
    ports: {
      inputs: [
        {
          id: "numeratorDecimal",
          label: "Numerator Decimal",
          required: true,
          valueType: { type: "string", format: "integer-decimal" },
        },
        {
          id: "denominatorDecimal",
          label: "Denominator Decimal",
          required: true,
          valueType: { type: "string", format: "integer-decimal" },
        },
      ],
      outputs: [
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        {
          id: "exactShare",
          label: "Exact Share",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = middleEasternWakfShareFractionTool.execute;
export default middleEasternWakfShareFractionTool;
