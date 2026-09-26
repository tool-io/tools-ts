import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly originPrice: number;
  readonly freight: number;
  readonly insurance: number;
  readonly duty: number;
};
export type Output = {
  readonly landedPrice: number;
  readonly freightShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    originPrice: { type: "number", minimum: 0 },
    freight: { type: "number", minimum: 0 },
    insurance: { type: "number", minimum: 0 },
    duty: { type: "number", minimum: 0 },
  },
  required: ["originPrice", "freight", "insurance", "duty"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    landedPrice: { type: "number" },
    freightShare: { type: "number" },
  },
  required: ["landedPrice", "freightShare"],
} as const;
/** Calculate historic commodity freight price share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { originPrice, freight, insurance, duty } = request;
  const compute = (): Output => {
    H.domain(
      originPrice >= 0 &&
        freight >= 0 &&
        insurance >= 0 &&
        duty >= 0 &&
        originPrice + freight + insurance + duty > 0,
    );
    return {
      landedPrice: originPrice + freight + insurance + duty,
      freightShare: freight / (originPrice + freight + insurance + duty),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { originPrice: 80, freight: 10, insurance: 5, duty: 5 },
  output: { landedPrice: 100, freightShare: 0.1 },
} satisfies ToolExample<Input, Output>;
export const historicCommodityFreightPriceShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "economic-history/historic-commodity-freight-price-share",
    title: "Historic Commodity Freight Price Share Tool",
    description:
      "Calculate historic commodity freight price share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        originPrice: { type: "number", minimum: 0 },
        freight: { type: "number", minimum: 0 },
        insurance: { type: "number", minimum: 0 },
        duty: { type: "number", minimum: 0 },
      },
      required: ["originPrice", "freight", "insurance", "duty"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        landedPrice: { type: "number" },
        freightShare: { type: "number" },
      },
      required: ["landedPrice", "freightShare"],
    },
    ports: {
      inputs: [
        {
          id: "originPrice",
          label: "Origin Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "freight",
          label: "Freight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "insurance",
          label: "Insurance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "duty",
          label: "Duty",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "landedPrice",
          label: "Landed Price",
          valueType: { type: "number" },
        },
        {
          id: "freightShare",
          label: "Freight Share",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = historicCommodityFreightPriceShareTool.execute;
export default historicCommodityFreightPriceShareTool;
