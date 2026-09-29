import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly domesticPrice: number;
  readonly borderPrice: number;
  readonly specificWedge: number;
};
export type Output = {
  readonly observedWedge: number;
  readonly suppliedAdValoremEquivalent: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    domesticPrice: { type: "number" },
    borderPrice: { type: "number", exclusiveMinimum: 0 },
    specificWedge: { type: "number" },
  },
  required: ["domesticPrice", "borderPrice", "specificWedge"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedWedge: { type: "number" },
    suppliedAdValoremEquivalent: { type: "number" },
    residual: { type: "number" },
  },
  required: ["observedWedge", "suppliedAdValoremEquivalent", "residual"],
} as const;
/** Express supplied price differences relative to a positive border-price base without attributing the wedge to policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { domesticPrice, borderPrice, specificWedge } = request;
  const compute = (): Output => {
    H.positive(borderPrice);
    return {
      observedWedge: (domesticPrice - borderPrice) / borderPrice,
      suppliedAdValoremEquivalent: specificWedge / borderPrice,
      residual: domesticPrice - borderPrice - specificWedge,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { domesticPrice: 120, borderPrice: 100, specificWedge: 15 },
  output: {
    observedWedge: 0.2,
    suppliedAdValoremEquivalent: 0.15,
    residual: 5,
  },
} satisfies ToolExample<Input, Output>;
export const priceWedgeAdValoremEquivalentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-economics/price-wedge-ad-valorem-equivalent",
    title: "Price Wedge Ad Valorem Equivalent Tool",
    description:
      "Express supplied price differences relative to a positive border-price base without attributing the wedge to policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        domesticPrice: { type: "number" },
        borderPrice: { type: "number", exclusiveMinimum: 0 },
        specificWedge: { type: "number" },
      },
      required: ["domesticPrice", "borderPrice", "specificWedge"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedWedge: { type: "number" },
        suppliedAdValoremEquivalent: { type: "number" },
        residual: { type: "number" },
      },
      required: ["observedWedge", "suppliedAdValoremEquivalent", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "domesticPrice",
          label: "Domestic Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "borderPrice",
          label: "Border Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "specificWedge",
          label: "Specific Wedge",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "observedWedge",
          label: "Observed Wedge",
          valueType: { type: "number" },
        },
        {
          id: "suppliedAdValoremEquivalent",
          label: "Supplied Ad Valorem Equivalent",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = priceWedgeAdValoremEquivalentTool.execute;
export default priceWedgeAdValoremEquivalentTool;
