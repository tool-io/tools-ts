import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wetPrice: number;
  readonly dryFraction: number;
  readonly dryBasisReference: number;
};
export type Output = { readonly dryEquivalent: number; readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wetPrice: { type: "number", minimum: 0 },
    dryFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
    dryBasisReference: { type: "number", minimum: 0 },
  },
  required: ["wetPrice", "dryFraction", "dryBasisReference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { dryEquivalent: { type: "number" }, gap: { type: "number" } },
  required: ["dryEquivalent", "gap"],
} as const;
/** Calculate crop residue price basis gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wetPrice, dryFraction, dryBasisReference } = request;
  const compute = (): Output => {
    H.domain(
      wetPrice >= 0 &&
        dryFraction > 0 &&
        dryFraction <= 1 &&
        dryBasisReference >= 0,
    );
    return {
      dryEquivalent: wetPrice / dryFraction,
      gap: wetPrice / dryFraction - dryBasisReference,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { wetPrice: 20, dryFraction: 0.5, dryBasisReference: 35 },
  output: { dryEquivalent: 40, gap: 5 },
} satisfies ToolExample<Input, Output>;
export const cropResiduePriceBasisGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agricultural-economics/crop-residue-price-basis-gap",
    title: "Crop Residue Price Basis Gap Tool",
    description:
      "Calculate crop residue price basis gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wetPrice: { type: "number", minimum: 0 },
        dryFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
        dryBasisReference: { type: "number", minimum: 0 },
      },
      required: ["wetPrice", "dryFraction", "dryBasisReference"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dryEquivalent: { type: "number" },
        gap: { type: "number" },
      },
      required: ["dryEquivalent", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "wetPrice",
          label: "Wet Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dryFraction",
          label: "Dry Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "dryBasisReference",
          label: "Dry Basis Reference",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "dryEquivalent",
          label: "Dry Equivalent",
          valueType: { type: "number" },
        },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = cropResiduePriceBasisGapTool.execute;
export default cropResiduePriceBasisGapTool;
