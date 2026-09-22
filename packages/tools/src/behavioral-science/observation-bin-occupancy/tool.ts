import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly times: readonly number[];
  readonly origin: number;
  readonly binWidth: number;
  readonly binCount: number;
};
export type Output = {
  readonly counts: readonly number[];
  readonly outsideCount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    times: { type: "array", maxItems: 256, items: { type: "number" } },
    origin: { type: "number" },
    binWidth: { type: "number", exclusiveMinimum: 0 },
    binCount: { type: "integer", minimum: 1, maximum: 256 },
  },
  required: ["times", "origin", "binWidth", "binCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    counts: { type: "array", maxItems: 256, items: { type: "integer" } },
    outsideCount: { type: "integer" },
  },
  required: ["counts", "outsideCount"],
} as const;
/** Count supplied observations in fixed half-open time bins without assigning behavioral categories. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { times, origin, binWidth, binCount } = request;
  const compute = (): Output => {
    H.positive(binWidth);
    H.integer(binCount, 1, 256);
    const counts = Array<number>(binCount).fill(0);
    let outsideCount = 0;
    for (const t of times) {
      const i = Math.floor((t - origin) / binWidth);
      if (i >= 0 && i < binCount) counts[i]++;
      else outsideCount++;
    }
    return { counts, outsideCount };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { times: [0, 1, 2, 4, -1], origin: 0, binWidth: 2, binCount: 2 },
  output: { counts: [2, 1], outsideCount: 2 },
} satisfies ToolExample<Input, Output>;
export const observationBinOccupancyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "behavioral-science/observation-bin-occupancy",
    title: "Observation Bin Occupancy Tool",
    description:
      "Count supplied observations in fixed half-open time bins without assigning behavioral categories.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        times: { type: "array", maxItems: 256, items: { type: "number" } },
        origin: { type: "number" },
        binWidth: { type: "number", exclusiveMinimum: 0 },
        binCount: { type: "integer", minimum: 1, maximum: 256 },
      },
      required: ["times", "origin", "binWidth", "binCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        counts: { type: "array", maxItems: 256, items: { type: "integer" } },
        outsideCount: { type: "integer" },
      },
      required: ["counts", "outsideCount"],
    },
    ports: {
      inputs: [
        {
          id: "times",
          label: "Times",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "origin",
          label: "Origin",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "binWidth",
          label: "Bin Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "binCount",
          label: "Bin Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "counts",
          label: "Counts",
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "outsideCount",
          label: "Outside Count",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = observationBinOccupancyTool.execute;
export default observationBinOccupancyTool;
