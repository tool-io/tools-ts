import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly area: number;
  readonly annualValuePerArea: number;
  readonly effectiveFraction: number;
  readonly displacementCost: number;
};
export type Output = { readonly grossValue: number; readonly netValue: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    area: { type: "number", minimum: 0 },
    annualValuePerArea: { type: "number" },
    effectiveFraction: { type: "number", minimum: 0, maximum: 1 },
    displacementCost: { type: "number", minimum: 0 },
  },
  required: [
    "area",
    "annualValuePerArea",
    "effectiveFraction",
    "displacementCost",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { grossValue: { type: "number" }, netValue: { type: "number" } },
  required: ["grossValue", "netValue"],
} as const;
/** One annual caller-valued ecosystem service flow; no benefit transfer, discounting or additionality estimate. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { area, annualValuePerArea, effectiveFraction, displacementCost } =
    request;
  const compute = (): Output => {
    H.domain(area >= 0 && displacementCost >= 0);
    H.probability(effectiveFraction);
    return {
      grossValue: area * annualValuePerArea * effectiveFraction,
      netValue:
        area * annualValuePerArea * effectiveFraction - displacementCost,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    area: 100,
    annualValuePerArea: 200,
    effectiveFraction: 0.5,
    displacementCost: 3000,
  },
  output: { grossValue: 10000, netValue: 7000 },
} satisfies ToolExample<Input, Output>;
export const ecosystemServiceAreaPriceOneYearTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-economics/ecosystem-service-area-price-one-year",
    title: "Ecosystem Service Area Price One Year Tool",
    description:
      "One annual caller-valued ecosystem service flow; no benefit transfer, discounting or additionality estimate.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        area: { type: "number", minimum: 0 },
        annualValuePerArea: { type: "number" },
        effectiveFraction: { type: "number", minimum: 0, maximum: 1 },
        displacementCost: { type: "number", minimum: 0 },
      },
      required: [
        "area",
        "annualValuePerArea",
        "effectiveFraction",
        "displacementCost",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossValue: { type: "number" },
        netValue: { type: "number" },
      },
      required: ["grossValue", "netValue"],
    },
    ports: {
      inputs: [
        {
          id: "area",
          label: "Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "annualValuePerArea",
          label: "Annual Value Per Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "effectiveFraction",
          label: "Effective Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "displacementCost",
          label: "Displacement Cost",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "grossValue",
          label: "Gross Value",
          valueType: { type: "number" },
        },
        { id: "netValue", label: "Net Value", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = ecosystemServiceAreaPriceOneYearTool.execute;
export default ecosystemServiceAreaPriceOneYearTool;
