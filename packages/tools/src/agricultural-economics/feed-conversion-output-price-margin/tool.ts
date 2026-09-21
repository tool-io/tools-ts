import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly feedPerOutput: number;
  readonly feedPrice: number;
  readonly outputPrice: number;
  readonly otherCostPerOutput: number;
};
export type Output = {
  readonly feedCostPerOutput: number;
  readonly margin: number;
  readonly breakEvenFeedPrice: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    feedPerOutput: { type: "number", exclusiveMinimum: 0 },
    feedPrice: { type: "number", minimum: 0 },
    outputPrice: { type: "number", minimum: 0 },
    otherCostPerOutput: { type: "number", minimum: 0 },
  },
  required: ["feedPerOutput", "feedPrice", "outputPrice", "otherCostPerOutput"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    feedCostPerOutput: { type: "number" },
    margin: { type: "number" },
    breakEvenFeedPrice: { type: "number" },
  },
  required: ["feedCostPerOutput", "margin", "breakEvenFeedPrice"],
} as const;
/** Calculate feed conversion output price margin from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { feedPerOutput, feedPrice, outputPrice, otherCostPerOutput } = request;
  const compute = (): Output => {
    H.positive(feedPerOutput);
    H.domain(feedPrice >= 0 && outputPrice >= 0 && otherCostPerOutput >= 0);
    return {
      feedCostPerOutput: feedPerOutput * feedPrice,
      margin: outputPrice - feedPerOutput * feedPrice - otherCostPerOutput,
      breakEvenFeedPrice: (outputPrice - otherCostPerOutput) / feedPerOutput,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    feedPerOutput: 2,
    feedPrice: 3,
    outputPrice: 10,
    otherCostPerOutput: 2,
  },
  output: { feedCostPerOutput: 6, margin: 2, breakEvenFeedPrice: 4 },
} satisfies ToolExample<Input, Output>;
export const feedConversionOutputPriceMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agricultural-economics/feed-conversion-output-price-margin",
    title: "Feed Conversion Output Price Margin Tool",
    description:
      "Calculate feed conversion output price margin from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        feedPerOutput: { type: "number", exclusiveMinimum: 0 },
        feedPrice: { type: "number", minimum: 0 },
        outputPrice: { type: "number", minimum: 0 },
        otherCostPerOutput: { type: "number", minimum: 0 },
      },
      required: [
        "feedPerOutput",
        "feedPrice",
        "outputPrice",
        "otherCostPerOutput",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        feedCostPerOutput: { type: "number" },
        margin: { type: "number" },
        breakEvenFeedPrice: { type: "number" },
      },
      required: ["feedCostPerOutput", "margin", "breakEvenFeedPrice"],
    },
    ports: {
      inputs: [
        {
          id: "feedPerOutput",
          label: "Feed Per Output",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "feedPrice",
          label: "Feed Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "outputPrice",
          label: "Output Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "otherCostPerOutput",
          label: "Other Cost Per Output",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "feedCostPerOutput",
          label: "Feed Cost Per Output",
          valueType: { type: "number" },
        },
        { id: "margin", label: "Margin", valueType: { type: "number" } },
        {
          id: "breakEvenFeedPrice",
          label: "Break Even Feed Price",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = feedConversionOutputPriceMarginTool.execute;
export default feedConversionOutputPriceMarginTool;
