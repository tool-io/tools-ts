import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly price: number;
  readonly modifiedDuration: number;
  readonly yieldChange: number;
  readonly convexity: number;
  readonly includeConvexity: boolean;
};
export type Output = {
  readonly durationChange: number;
  readonly convexityChange: number;
  readonly estimatedPrice: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    price: { type: "number", exclusiveMinimum: 0 },
    modifiedDuration: { type: "number" },
    yieldChange: { type: "number" },
    convexity: { type: "number" },
    includeConvexity: { type: "boolean" },
  },
  required: [
    "price",
    "modifiedDuration",
    "yieldChange",
    "convexity",
    "includeConvexity",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    durationChange: { type: "number" },
    convexityChange: { type: "number" },
    estimatedPrice: { type: "number" },
  },
  required: ["durationChange", "convexityChange", "estimatedPrice"],
} as const;
/** Local duration and optional convexity approximation for an aligned yield shift; not an exact repricing. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { price, modifiedDuration, yieldChange, convexity, includeConvexity } =
    request;
  const compute = (): Output => {
    H.positive(price);
    return {
      durationChange: -price * modifiedDuration * yieldChange,
      convexityChange: includeConvexity
        ? 0.5 * price * convexity * yieldChange ** 2
        : 0,
      estimatedPrice:
        price -
        price * modifiedDuration * yieldChange +
        (includeConvexity ? 0.5 * price * convexity * yieldChange ** 2 : 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    price: 100,
    modifiedDuration: 5,
    yieldChange: 0.01,
    convexity: 30,
    includeConvexity: true,
  },
  output: { durationChange: -5, convexityChange: 0.15, estimatedPrice: 95.15 },
} satisfies ToolExample<Input, Output>;
export const durationYieldFirstOrderPriceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "financial-economics/duration-yield-first-order-price-gap",
    title: "Duration Yield First Order Price Gap Tool",
    description:
      "Local duration and optional convexity approximation for an aligned yield shift; not an exact repricing.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        price: { type: "number", exclusiveMinimum: 0 },
        modifiedDuration: { type: "number" },
        yieldChange: { type: "number" },
        convexity: { type: "number" },
        includeConvexity: { type: "boolean" },
      },
      required: [
        "price",
        "modifiedDuration",
        "yieldChange",
        "convexity",
        "includeConvexity",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        durationChange: { type: "number" },
        convexityChange: { type: "number" },
        estimatedPrice: { type: "number" },
      },
      required: ["durationChange", "convexityChange", "estimatedPrice"],
    },
    ports: {
      inputs: [
        {
          id: "price",
          label: "Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "modifiedDuration",
          label: "Modified Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "yieldChange",
          label: "Yield Change",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "convexity",
          label: "Convexity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includeConvexity",
          label: "Include Convexity",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "durationChange",
          label: "Duration Change",
          valueType: { type: "number" },
        },
        {
          id: "convexityChange",
          label: "Convexity Change",
          valueType: { type: "number" },
        },
        {
          id: "estimatedPrice",
          label: "Estimated Price",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = durationYieldFirstOrderPriceGapTool.execute;
export default durationYieldFirstOrderPriceGapTool;
