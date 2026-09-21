import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wetWeight: number;
  readonly measuredMoisture: number;
  readonly targetMoisture: number;
  readonly handlingLossFraction: number;
};
export type Output = {
  readonly moistureAdjustedWeight: number;
  readonly saleWeight: number;
  readonly shrink: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wetWeight: { type: "number", minimum: 0 },
    measuredMoisture: { type: "number", minimum: 0, exclusiveMaximum: 1 },
    targetMoisture: { type: "number", minimum: 0, exclusiveMaximum: 1 },
    handlingLossFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "wetWeight",
    "measuredMoisture",
    "targetMoisture",
    "handlingLossFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    moistureAdjustedWeight: { type: "number" },
    saleWeight: { type: "number" },
    shrink: { type: "number" },
  },
  required: ["moistureAdjustedWeight", "saleWeight", "shrink"],
} as const;
/** Conserve dry matter to a supplied reference moisture, then deduct a separate explicit handling-loss fraction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wetWeight, measuredMoisture, targetMoisture, handlingLossFraction } =
    request;
  const compute = (): Output => {
    H.domain(
      wetWeight >= 0 &&
        measuredMoisture >= 0 &&
        measuredMoisture < 1 &&
        targetMoisture >= 0 &&
        targetMoisture < 1,
    );
    H.probability(handlingLossFraction);
    return {
      moistureAdjustedWeight:
        (wetWeight * (1 - measuredMoisture)) / (1 - targetMoisture),
      saleWeight:
        ((wetWeight * (1 - measuredMoisture)) / (1 - targetMoisture)) *
        (1 - handlingLossFraction),
      shrink:
        wetWeight -
        ((wetWeight * (1 - measuredMoisture)) / (1 - targetMoisture)) *
          (1 - handlingLossFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    wetWeight: 1000,
    measuredMoisture: 0.2,
    targetMoisture: 0.1,
    handlingLossFraction: 0.01,
  },
  output: {
    moistureAdjustedWeight: 888.8888888888889,
    saleWeight: 880,
    shrink: 120,
  },
} satisfies ToolExample<Input, Output>;
export const cropPurchaseMoistureShrinkTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agribusiness/crop-purchase-moisture-shrink-term",
    title: "Crop Purchase Moisture Shrink Term Tool",
    description:
      "Conserve dry matter to a supplied reference moisture, then deduct a separate explicit handling-loss fraction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wetWeight: { type: "number", minimum: 0 },
        measuredMoisture: { type: "number", minimum: 0, exclusiveMaximum: 1 },
        targetMoisture: { type: "number", minimum: 0, exclusiveMaximum: 1 },
        handlingLossFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: [
        "wetWeight",
        "measuredMoisture",
        "targetMoisture",
        "handlingLossFraction",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        moistureAdjustedWeight: { type: "number" },
        saleWeight: { type: "number" },
        shrink: { type: "number" },
      },
      required: ["moistureAdjustedWeight", "saleWeight", "shrink"],
    },
    ports: {
      inputs: [
        {
          id: "wetWeight",
          label: "Wet Weight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredMoisture",
          label: "Measured Moisture",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetMoisture",
          label: "Target Moisture",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "handlingLossFraction",
          label: "Handling Loss Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "moistureAdjustedWeight",
          label: "Moisture Adjusted Weight",
          valueType: { type: "number" },
        },
        {
          id: "saleWeight",
          label: "Sale Weight",
          valueType: { type: "number" },
        },
        { id: "shrink", label: "Shrink", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = cropPurchaseMoistureShrinkTermTool.execute;
export default cropPurchaseMoistureShrinkTermTool;
