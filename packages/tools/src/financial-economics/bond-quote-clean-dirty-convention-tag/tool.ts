import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly quoteId: string;
  readonly priceConvention: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quoteId: { type: "string", maxLength: 8192, minLength: 1 },
    priceConvention: {
      type: "string",
      maxLength: 8192,
      enum: ["clean", "dirty", "unspecified"],
    },
  },
  required: ["quoteId", "priceConvention"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly supplied bond quote price convention without estimating accrued interest or pricing a bond. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { quoteId, priceConvention } = request;
  const compute = (): Output => {
    H.domain(quoteId.length > 0, "quoteId");
    H.domain(
      ["clean", "dirty", "unspecified"].includes(priceConvention),
      "priceConvention",
    );
    return { label: quoteId + " [" + priceConvention + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { quoteId: "Q17", priceConvention: "clean" },
  output: { label: "Q17 [clean]" },
} satisfies ToolExample<Input, Output>;
export const bondQuoteCleanDirtyConventionTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "financial-economics/bond-quote-clean-dirty-convention-tag",
    title: "Bond Quote Clean Dirty Convention Tag Tool",
    description:
      "Label an explicitly supplied bond quote price convention without estimating accrued interest or pricing a bond.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quoteId: { type: "string", maxLength: 8192, minLength: 1 },
        priceConvention: {
          type: "string",
          maxLength: 8192,
          enum: ["clean", "dirty", "unspecified"],
        },
      },
      required: ["quoteId", "priceConvention"],
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
          id: "quoteId",
          label: "Quote Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "priceConvention",
          label: "Price Convention",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = bondQuoteCleanDirtyConventionTagTool.execute;
export default bondQuoteCleanDirtyConventionTagTool;
