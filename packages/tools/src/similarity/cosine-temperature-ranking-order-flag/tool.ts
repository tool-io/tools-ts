import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  positive,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly left: number;
  readonly right: number;
  readonly temperature: number;
};
export type Output = { readonly order: number; readonly scaledGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    left: { type: "number" },
    right: { type: "number" },
    temperature: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["left", "right", "temperature"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { order: { type: "integer" }, scaledGap: { type: "number" } },
  required: ["order", "scaledGap"],
} as const;
/** Compute cosine temperature ranking order flag from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { left, right, temperature } = input;
  const compute = (): Output => {
    domain(left >= -1 && left <= 1 && right >= -1 && right <= 1);
    positive(temperature);
    return {
      order: Math.sign(left - right),
      scaledGap: (left - right) / temperature,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { left: 0.75, right: 0.25, temperature: 0.5 },
  output: { order: 1, scaledGap: 1 },
} satisfies ToolExample<Input, Output>;
export const cosineTemperatureRankingOrderFlagTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "similarity/cosine-temperature-ranking-order-flag",
  title: "Cosine Temperature Ranking Order Flag Tool",
  description:
    "Compute cosine temperature ranking order flag from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "left",
        label: "Left",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "right",
        label: "Right",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "temperature",
        label: "Temperature",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      { id: "order", label: "Order", valueType: { type: "integer" } },
      { id: "scaledGap", label: "Scaled Gap", valueType: { type: "number" } },
    ],
  },
});
export const run = cosineTemperatureRankingOrderFlagTool.execute;
export default cosineTemperatureRankingOrderFlagTool;
