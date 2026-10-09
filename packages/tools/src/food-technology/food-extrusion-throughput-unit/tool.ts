import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly kilogramsPerHour: number };
export type Output = {
  readonly gramsPerMinute: number;
  readonly kilogramsPerSecond: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { kilogramsPerHour: { type: "number", minimum: 0 } },
  required: ["kilogramsPerHour"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gramsPerMinute: { type: "number" },
    kilogramsPerSecond: { type: "number" },
  },
  required: ["gramsPerMinute", "kilogramsPerSecond"],
} as const;
/** Convert an explicit extrusion mass throughput from kilograms per hour to grams per minute and kilograms per second. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { kilogramsPerHour } = request;
  const compute = (): Output => {
    H.domain(kilogramsPerHour >= 0, "kilogramsPerHour");
    return {
      gramsPerMinute: (kilogramsPerHour * 1000) / 60,
      kilogramsPerSecond: kilogramsPerHour / 3600,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { kilogramsPerHour: 36 },
  output: { gramsPerMinute: 600, kilogramsPerSecond: 0.01 },
} satisfies ToolExample<Input, Output>;
export const foodExtrusionThroughputUnitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "food-technology",
        "food technology",
        "research and quality management",
      ],
      keywords: ["food technology", "research and quality management"],
    },
    id: "food-technology/food-extrusion-throughput-unit",
    title: "Food Extrusion Throughput Unit",
    description:
      "Convert an explicit extrusion mass throughput from kilograms per hour to grams per minute and kilograms per second.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { kilogramsPerHour: { type: "number", minimum: 0 } },
      required: ["kilogramsPerHour"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gramsPerMinute: { type: "number" },
        kilogramsPerSecond: { type: "number" },
      },
      required: ["gramsPerMinute", "kilogramsPerSecond"],
    },
    ports: {
      inputs: [
        {
          id: "kilogramsPerHour",
          label: "Kilograms Per Hour",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "gramsPerMinute",
          label: "Grams Per Minute",
          valueType: { type: "number" },
        },
        {
          id: "kilogramsPerSecond",
          label: "Kilograms Per Second",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = foodExtrusionThroughputUnitTool.execute;
export default foodExtrusionThroughputUnitTool;
