import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wetMass: number;
  readonly moisture: number;
  readonly referenceMoisture: number;
  readonly referencePrice: number;
  readonly priceChange: number;
};
export type Output = {
  readonly standardMass: number;
  readonly revenue: number;
  readonly priceChangeContribution: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wetMass: { type: "number", minimum: 0 },
    moisture: { type: "number", minimum: 0, exclusiveMaximum: 1 },
    referenceMoisture: { type: "number", minimum: 0, exclusiveMaximum: 1 },
    referencePrice: { type: "number" },
    priceChange: { type: "number" },
  },
  required: [
    "wetMass",
    "moisture",
    "referenceMoisture",
    "referencePrice",
    "priceChange",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    standardMass: { type: "number" },
    revenue: { type: "number" },
    priceChangeContribution: { type: "number" },
  },
  required: ["standardMass", "revenue", "priceChangeContribution"],
} as const;
/** Calculate crop revenue moisture price cross term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wetMass, moisture, referenceMoisture, referencePrice, priceChange } =
    request;
  const compute = (): Output => {
    H.domain(
      wetMass >= 0 &&
        moisture >= 0 &&
        moisture < 1 &&
        referenceMoisture >= 0 &&
        referenceMoisture < 1 &&
        referencePrice + priceChange >= 0,
    );
    return {
      standardMass: (wetMass * (1 - moisture)) / (1 - referenceMoisture),
      revenue:
        ((wetMass * (1 - moisture)) / (1 - referenceMoisture)) *
        (referencePrice + priceChange),
      priceChangeContribution:
        ((wetMass * (1 - moisture)) / (1 - referenceMoisture)) * priceChange,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    wetMass: 100,
    moisture: 0.2,
    referenceMoisture: 0.2,
    referencePrice: 10,
    priceChange: 2,
  },
  output: { standardMass: 100, revenue: 1200, priceChangeContribution: 200 },
} satisfies ToolExample<Input, Output>;
export const cropRevenueMoisturePriceCrossTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agricultural-economics/crop-revenue-moisture-price-cross-term",
    title: "Crop Revenue Moisture Price Cross Term Tool",
    description:
      "Calculate crop revenue moisture price cross term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wetMass: { type: "number", minimum: 0 },
        moisture: { type: "number", minimum: 0, exclusiveMaximum: 1 },
        referenceMoisture: { type: "number", minimum: 0, exclusiveMaximum: 1 },
        referencePrice: { type: "number" },
        priceChange: { type: "number" },
      },
      required: [
        "wetMass",
        "moisture",
        "referenceMoisture",
        "referencePrice",
        "priceChange",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        standardMass: { type: "number" },
        revenue: { type: "number" },
        priceChangeContribution: { type: "number" },
      },
      required: ["standardMass", "revenue", "priceChangeContribution"],
    },
    ports: {
      inputs: [
        {
          id: "wetMass",
          label: "Wet Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "moisture",
          label: "Moisture",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceMoisture",
          label: "Reference Moisture",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referencePrice",
          label: "Reference Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "priceChange",
          label: "Price Change",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "standardMass",
          label: "Standard Mass",
          valueType: { type: "number" },
        },
        { id: "revenue", label: "Revenue", valueType: { type: "number" } },
        {
          id: "priceChangeContribution",
          label: "Price Change Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cropRevenueMoisturePriceCrossTermTool.execute;
export default cropRevenueMoisturePriceCrossTermTool;
