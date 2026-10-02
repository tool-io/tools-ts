import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly toothIndex: number;
  readonly surfaceIndex: number;
  readonly surfacesPerTooth: number;
  readonly origin: number;
};
export type Output = {
  readonly flatIndex: number;
  readonly oneBasedIndex: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    toothIndex: { type: "integer", minimum: 0 },
    surfaceIndex: { type: "integer", minimum: 0 },
    surfacesPerTooth: { type: "integer", minimum: 1 },
    origin: { type: "integer", minimum: 0, maximum: 1 },
  },
  required: ["toothIndex", "surfaceIndex", "surfacesPerTooth", "origin"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    flatIndex: { type: "integer" },
    oneBasedIndex: { type: "integer" },
  },
  required: ["flatIndex", "oneBasedIndex"],
} as const;
/** Address a supplied tooth/surface chart using explicit indexing conventions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { toothIndex, surfaceIndex, surfacesPerTooth, origin } = request;
  const compute = (): Output => {
    H.integer(toothIndex, 0);
    H.integer(surfacesPerTooth, 1);
    H.integer(surfaceIndex, 0, surfacesPerTooth - 1);
    H.integer(origin, 0, 1);
    return {
      flatIndex: toothIndex * surfacesPerTooth + surfaceIndex + origin,
      oneBasedIndex: toothIndex * surfacesPerTooth + surfaceIndex + 1,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { toothIndex: 2, surfaceIndex: 4, surfacesPerTooth: 6, origin: 0 },
  output: { flatIndex: 16, oneBasedIndex: 17 },
} satisfies ToolExample<Input, Output>;
export const periodontalChartToothSurfaceIndexTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "periodontology/periodontal-chart-tooth-surface-index-term",
      title: "Periodontal Chart Tooth Surface Index Term Tool",
      description:
        "Address a supplied tooth/surface chart using explicit indexing conventions.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          toothIndex: { type: "integer", minimum: 0 },
          surfaceIndex: { type: "integer", minimum: 0 },
          surfacesPerTooth: { type: "integer", minimum: 1 },
          origin: { type: "integer", minimum: 0, maximum: 1 },
        },
        required: ["toothIndex", "surfaceIndex", "surfacesPerTooth", "origin"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          flatIndex: { type: "integer" },
          oneBasedIndex: { type: "integer" },
        },
        required: ["flatIndex", "oneBasedIndex"],
      },
      ports: {
        inputs: [
          {
            id: "toothIndex",
            label: "Tooth Index",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "surfaceIndex",
            label: "Surface Index",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "surfacesPerTooth",
            label: "Surfaces Per Tooth",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "origin",
            label: "Origin",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "flatIndex",
            label: "Flat Index",
            valueType: { type: "integer" },
          },
          {
            id: "oneBasedIndex",
            label: "One Based Index",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = periodontalChartToothSurfaceIndexTermTool.execute;
export default periodontalChartToothSurfaceIndexTermTool;
