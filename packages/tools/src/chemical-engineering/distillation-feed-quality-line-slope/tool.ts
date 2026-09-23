import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly feedQuality: number;
  readonly feedComposition: number;
};
export type Output = { readonly slope: number; readonly intercept: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    feedQuality: { type: "number" },
    feedComposition: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["feedQuality", "feedComposition"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { slope: { type: "number" }, intercept: { type: "number" } },
  required: ["slope", "intercept"],
} as const;
/** McCabe-Thiele q-line y=q*x/(q-1)-zF/(q-1); saturated liquid q=1 is vertical and has no finite slope. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { feedQuality, feedComposition } = request;
  const compute = (): Output => {
    H.domain(feedQuality !== 1);
    H.probability(feedComposition);
    return {
      slope: feedQuality / (feedQuality - 1),
      intercept: -feedComposition / (feedQuality - 1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { feedQuality: 0.5, feedComposition: 0.4 },
  output: { slope: -1, intercept: 0.8 },
} satisfies ToolExample<Input, Output>;
export const distillationFeedQualityLineSlopeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "chemical-engineering/distillation-feed-quality-line-slope",
    title: "Distillation Feed Quality Line Slope Tool",
    description:
      "McCabe-Thiele q-line y=q*x/(q-1)-zF/(q-1); saturated liquid q=1 is vertical and has no finite slope.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        feedQuality: { type: "number" },
        feedComposition: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["feedQuality", "feedComposition"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { slope: { type: "number" }, intercept: { type: "number" } },
      required: ["slope", "intercept"],
    },
    ports: {
      inputs: [
        {
          id: "feedQuality",
          label: "Feed Quality",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "feedComposition",
          label: "Feed Composition",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "slope", label: "Slope", valueType: { type: "number" } },
        { id: "intercept", label: "Intercept", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = distillationFeedQualityLineSlopeTool.execute;
export default distillationFeedQualityLineSlopeTool;
