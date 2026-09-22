import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly humidity: number;
  readonly lower: number;
  readonly upper: number;
};
export type Output = {
  readonly below: number;
  readonly above: number;
  readonly inside: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    humidity: { type: "number", minimum: 0, maximum: 100 },
    lower: { type: "number", minimum: 0 },
    upper: { type: "number", maximum: 100 },
  },
  required: ["humidity", "lower", "upper"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    below: { type: "number" },
    above: { type: "number" },
    inside: { type: "boolean" },
  },
  required: ["below", "above", "inside"],
} as const;
/** Compare measured relative humidity in percent with an explicit band, without choosing conservation limits. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { humidity, lower, upper } = request;
  const compute = (): Output => {
    H.domain(
      humidity >= 0 &&
        humidity <= 100 &&
        lower >= 0 &&
        upper <= 100 &&
        lower <= upper,
    );
    return {
      below: Math.max(0, lower - humidity),
      above: Math.max(0, humidity - upper),
      inside: humidity >= lower && humidity <= upper,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { humidity: 65, lower: 40, upper: 60 },
  output: { below: 0, above: 5, inside: false },
} satisfies ToolExample<Input, Output>;
export const humidityBandExcursionDistanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-conservation/humidity-band-excursion-distance",
    title: "Humidity Band Excursion Distance Tool",
    description:
      "Compare measured relative humidity in percent with an explicit band, without choosing conservation limits.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        humidity: { type: "number", minimum: 0, maximum: 100 },
        lower: { type: "number", minimum: 0 },
        upper: { type: "number", maximum: 100 },
      },
      required: ["humidity", "lower", "upper"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        below: { type: "number" },
        above: { type: "number" },
        inside: { type: "boolean" },
      },
      required: ["below", "above", "inside"],
    },
    ports: {
      inputs: [
        {
          id: "humidity",
          label: "Humidity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lower",
          label: "Lower",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upper",
          label: "Upper",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "below", label: "Below", valueType: { type: "number" } },
        { id: "above", label: "Above", valueType: { type: "number" } },
        { id: "inside", label: "Inside", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = humidityBandExcursionDistanceTool.execute;
export default humidityBandExcursionDistanceTool;
