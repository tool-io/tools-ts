import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly count: number; readonly distance: number };
export type Output = { readonly countPerDistance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    count: { type: "integer", minimum: 0 },
    distance: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["count", "distance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { countPerDistance: { type: "number" } },
  required: ["countPerDistance"],
} as const;
/** Calculate seed meter count per distance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { count, distance } = request;
  const compute = (): Output => {
    H.integer(count, 0);
    H.positive(distance);
    return { countPerDistance: count / distance };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { count: 120, distance: 30 },
  output: { countPerDistance: 4 },
} satisfies ToolExample<Input, Output>;
export const seedMeterCountPerDistanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrotechnology/seed-meter-count-per-distance",
    title: "Seed Meter Count Per Distance Tool",
    description:
      "Calculate seed meter count per distance from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        count: { type: "integer", minimum: 0 },
        distance: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["count", "distance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { countPerDistance: { type: "number" } },
      required: ["countPerDistance"],
    },
    ports: {
      inputs: [
        {
          id: "count",
          label: "Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "distance",
          label: "Distance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "countPerDistance",
          label: "Count Per Distance",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = seedMeterCountPerDistanceTool.execute;
export default seedMeterCountPerDistanceTool;
