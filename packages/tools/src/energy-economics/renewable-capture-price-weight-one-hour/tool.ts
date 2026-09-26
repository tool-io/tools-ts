import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly generation: number;
  readonly price: number;
  readonly totalGeneration: number;
};
export type Output = {
  readonly weight: number;
  readonly capturedPriceContribution: number;
  readonly revenue: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    generation: { type: "number", minimum: 0 },
    price: { type: "number" },
    totalGeneration: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["generation", "price", "totalGeneration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weight: { type: "number" },
    capturedPriceContribution: { type: "number" },
    revenue: { type: "number" },
  },
  required: ["weight", "capturedPriceContribution", "revenue"],
} as const;
/** Calculate renewable capture price weight one hour from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { generation, price, totalGeneration } = request;
  const compute = (): Output => {
    H.positive(totalGeneration);
    H.domain(generation >= 0 && generation <= totalGeneration);
    return {
      weight: generation / totalGeneration,
      capturedPriceContribution: (generation * price) / totalGeneration,
      revenue: generation * price,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { generation: 20, price: 50, totalGeneration: 100 },
  output: { weight: 0.2, capturedPriceContribution: 10, revenue: 1000 },
} satisfies ToolExample<Input, Output>;
export const renewableCapturePriceWeightOneHourTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "energy-economics/renewable-capture-price-weight-one-hour",
    title: "Renewable Capture Price Weight One Hour Tool",
    description:
      "Calculate renewable capture price weight one hour from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        generation: { type: "number", minimum: 0 },
        price: { type: "number" },
        totalGeneration: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["generation", "price", "totalGeneration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        weight: { type: "number" },
        capturedPriceContribution: { type: "number" },
        revenue: { type: "number" },
      },
      required: ["weight", "capturedPriceContribution", "revenue"],
    },
    ports: {
      inputs: [
        {
          id: "generation",
          label: "Generation",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "price",
          label: "Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalGeneration",
          label: "Total Generation",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "weight", label: "Weight", valueType: { type: "number" } },
        {
          id: "capturedPriceContribution",
          label: "Captured Price Contribution",
          valueType: { type: "number" },
        },
        { id: "revenue", label: "Revenue", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = renewableCapturePriceWeightOneHourTool.execute;
export default renewableCapturePriceWeightOneHourTool;
