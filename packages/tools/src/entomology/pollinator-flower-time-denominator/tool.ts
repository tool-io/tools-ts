import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly flowerCounts: readonly number[];
  readonly durations: readonly number[];
};
export type Output = { readonly flowerTime: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    flowerCounts: {
      type: "array",
      maxItems: 256,
      items: { type: "integer", minimum: 0 },
    },
    durations: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
  },
  required: ["flowerCounts", "durations"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { flowerTime: { type: "number" } },
  required: ["flowerTime"],
} as const;
/** Calculate pollinator flower time denominator from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { flowerCounts, durations } = request;
  const compute = (): Output => {
    H.domain(
      flowerCounts.every((x) => x >= 0) && durations.every((x) => x >= 0),
    );
    return { flowerTime: H.dot(flowerCounts, durations) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { flowerCounts: [10, 20], durations: [2, 3] },
  output: { flowerTime: 80 },
} satisfies ToolExample<Input, Output>;
export const pollinatorFlowerTimeDenominatorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entomology/pollinator-flower-time-denominator",
    title: "Pollinator Flower Time Denominator Tool",
    description:
      "Calculate pollinator flower time denominator from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        flowerCounts: {
          type: "array",
          maxItems: 256,
          items: { type: "integer", minimum: 0 },
        },
        durations: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
      },
      required: ["flowerCounts", "durations"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { flowerTime: { type: "number" } },
      required: ["flowerTime"],
    },
    ports: {
      inputs: [
        {
          id: "flowerCounts",
          label: "Flower Counts",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "durations",
          label: "Durations",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "flowerTime",
          label: "Flower Time",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pollinatorFlowerTimeDenominatorTool.execute;
export default pollinatorFlowerTimeDenominatorTool;
