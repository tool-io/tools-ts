import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly quotePercentOfPar: number;
  readonly parAmount: number;
};
export type Output = { readonly cashPrice: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quotePercentOfPar: { type: "number", minimum: 0 },
    parAmount: { type: "number", minimum: 0 },
  },
  required: ["quotePercentOfPar", "parAmount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { cashPrice: { type: "number" } },
  required: ["cashPrice"],
} as const;
/** Convert a bond quote expressed as percent of par to a cash price for an explicit par amount, excluding accrued interest and fees. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { quotePercentOfPar, parAmount } = request;
  const compute = (): Output => {
    H.domain(quotePercentOfPar >= 0 && parAmount >= 0, "quotePercentOfPar");
    return { cashPrice: (quotePercentOfPar / 100) * parAmount };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { quotePercentOfPar: 98.5, parAmount: 1000 },
  output: { cashPrice: 985 },
} satisfies ToolExample<Input, Output>;
export const quotedPricePerParCrosswalkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "finance/quoted-price-per-par-crosswalk",
    title: "Quoted Price Per PAR Crosswalk Tool",
    description:
      "Convert a bond quote expressed as percent of par to a cash price for an explicit par amount, excluding accrued interest and fees.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quotePercentOfPar: { type: "number", minimum: 0 },
        parAmount: { type: "number", minimum: 0 },
      },
      required: ["quotePercentOfPar", "parAmount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { cashPrice: { type: "number" } },
      required: ["cashPrice"],
    },
    ports: {
      inputs: [
        {
          id: "quotePercentOfPar",
          label: "Quote Percent Of Par",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "parAmount",
          label: "Par Amount",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "cashPrice", label: "Cash Price", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = quotedPricePerParCrosswalkTool.execute;
export default quotedPricePerParCrosswalkTool;
