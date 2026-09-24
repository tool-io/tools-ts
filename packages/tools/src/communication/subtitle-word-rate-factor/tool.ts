import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wordCount: number;
  readonly visibleSeconds: number;
  readonly secondsPerRateUnit: number;
};
export type Output = { readonly rate: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wordCount: { type: "integer", minimum: 0 },
    visibleSeconds: { type: "number", exclusiveMinimum: 0 },
    secondsPerRateUnit: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["wordCount", "visibleSeconds", "secondsPerRateUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { rate: { type: "number" } },
  required: ["rate"],
} as const;
/** Calculate subtitle word rate factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wordCount, visibleSeconds, secondsPerRateUnit } = request;
  const compute = (): Output => {
    H.integer(wordCount, 0);
    H.positive(visibleSeconds);
    H.positive(secondsPerRateUnit);
    return { rate: (wordCount / visibleSeconds) * secondsPerRateUnit };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { wordCount: 10, visibleSeconds: 5, secondsPerRateUnit: 60 },
  output: { rate: 120 },
} satisfies ToolExample<Input, Output>;
export const subtitleWordRateFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "communication/subtitle-word-rate-factor",
    title: "Subtitle Word Rate Factor Tool",
    description:
      "Calculate subtitle word rate factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wordCount: { type: "integer", minimum: 0 },
        visibleSeconds: { type: "number", exclusiveMinimum: 0 },
        secondsPerRateUnit: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["wordCount", "visibleSeconds", "secondsPerRateUnit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { rate: { type: "number" } },
      required: ["rate"],
    },
    ports: {
      inputs: [
        {
          id: "wordCount",
          label: "Word Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "visibleSeconds",
          label: "Visible Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondsPerRateUnit",
          label: "Seconds Per Rate Unit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "rate", label: "Rate", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = subtitleWordRateFactorTool.execute;
export default subtitleWordRateFactorTool;
