import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly emissionTonnesPerMwh: number;
  readonly carbonPricePerTonne: number;
  readonly passThroughFraction: number;
};
export type Output = {
  readonly grossCarbonCost: number;
  readonly priceIncrement: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    emissionTonnesPerMwh: { type: "number", minimum: 0 },
    carbonPricePerTonne: { type: "number" },
    passThroughFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "emissionTonnesPerMwh",
    "carbonPricePerTonne",
    "passThroughFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossCarbonCost: { type: "number" },
    priceIncrement: { type: "number" },
  },
  required: ["grossCarbonCost", "priceIncrement"],
} as const;
/** Calculate carbon cost pass through one mwh from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { emissionTonnesPerMwh, carbonPricePerTonne, passThroughFraction } =
    request;
  const compute = (): Output => {
    H.domain(emissionTonnesPerMwh >= 0);
    H.probability(passThroughFraction);
    return {
      grossCarbonCost: emissionTonnesPerMwh * carbonPricePerTonne,
      priceIncrement:
        emissionTonnesPerMwh * carbonPricePerTonne * passThroughFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    emissionTonnesPerMwh: 0.5,
    carbonPricePerTonne: 80,
    passThroughFraction: 0.75,
  },
  output: { grossCarbonCost: 40, priceIncrement: 30 },
} satisfies ToolExample<Input, Output>;
export const carbonCostPassThroughOneMwhTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "energy-economics/carbon-cost-pass-through-one-mwh",
    title: "Carbon Cost Pass Through One Mwh Tool",
    description:
      "Calculate carbon cost pass through one mwh from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        emissionTonnesPerMwh: { type: "number", minimum: 0 },
        carbonPricePerTonne: { type: "number" },
        passThroughFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: [
        "emissionTonnesPerMwh",
        "carbonPricePerTonne",
        "passThroughFraction",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossCarbonCost: { type: "number" },
        priceIncrement: { type: "number" },
      },
      required: ["grossCarbonCost", "priceIncrement"],
    },
    ports: {
      inputs: [
        {
          id: "emissionTonnesPerMwh",
          label: "Emission Tonnes Per Mwh",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "carbonPricePerTonne",
          label: "Carbon Price Per Tonne",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "passThroughFraction",
          label: "Pass Through Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "grossCarbonCost",
          label: "Gross Carbon Cost",
          valueType: { type: "number" },
        },
        {
          id: "priceIncrement",
          label: "Price Increment",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = carbonCostPassThroughOneMwhTool.execute;
export default carbonCostPassThroughOneMwhTool;
