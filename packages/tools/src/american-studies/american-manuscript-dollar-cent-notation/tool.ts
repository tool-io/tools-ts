import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dollarsDecimal: string;
  readonly cents: number;
  readonly negative: boolean;
};
export type Output = { readonly amountDecimal: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dollarsDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
    cents: { type: "integer", minimum: 0, maximum: 99 },
    negative: { type: "boolean" },
  },
  required: ["dollarsDecimal", "cents", "negative"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    amountDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
  },
  required: ["amountDecimal"],
} as const;
/** Normalize separately transcribed dollar, cent and sign fields into an exact two-decimal string without interpreting a manuscript image. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dollarsDecimal, cents, negative } = request;
  const compute = (): Output => {
    const dollars = H.decimal(dollarsDecimal);
    H.domain(dollars >= 0n, "dollarsDecimal");
    (H.domain(
      Number.isSafeInteger(cents) && cents >= 0 && cents <= 99,
      "cents",
    ),
      cents);
    return {
      amountDecimal:
        (negative && (dollars !== 0n || cents !== 0) ? "-" : "") +
        dollars.toString() +
        "." +
        String(cents).padStart(2, "0"),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dollarsDecimal: "12", cents: 5, negative: false },
  output: { amountDecimal: "12.05" },
} satisfies ToolExample<Input, Output>;
export const americanManuscriptDollarCentNotationTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "american-studies/american-manuscript-dollar-cent-notation",
      title: "American Manuscript Dollar Cent Notation Tool",
      description:
        "Normalize separately transcribed dollar, cent and sign fields into an exact two-decimal string without interpreting a manuscript image.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          dollarsDecimal: {
            type: "string",
            maxLength: 8192,
            format: "integer-decimal",
          },
          cents: { type: "integer", minimum: 0, maximum: 99 },
          negative: { type: "boolean" },
        },
        required: ["dollarsDecimal", "cents", "negative"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          amountDecimal: {
            type: "string",
            maxLength: 8192,
            format: "integer-decimal",
          },
        },
        required: ["amountDecimal"],
      },
      ports: {
        inputs: [
          {
            id: "dollarsDecimal",
            label: "Dollars Decimal",
            required: true,
            valueType: { type: "string", format: "integer-decimal" },
          },
          {
            id: "cents",
            label: "Cents",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "negative",
            label: "Negative",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "amountDecimal",
            label: "Amount Decimal",
            valueType: { type: "string", format: "integer-decimal" },
          },
        ],
      },
    },
    calculate,
  });
export const run = americanManuscriptDollarCentNotationTool.execute;
export default americanManuscriptDollarCentNotationTool;
