import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly samples: readonly number[];
  readonly saturationLevel: number;
  readonly equalitySaturated: boolean;
};
export type Output = {
  readonly saturatedPositions: readonly number[];
  readonly saturatedCount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    samples: { type: "array", maxItems: 256, items: { type: "number" } },
    saturationLevel: { type: "number" },
    equalitySaturated: { type: "boolean" },
  },
  required: ["samples", "saturationLevel", "equalitySaturated"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    saturatedPositions: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
    saturatedCount: { type: "integer" },
  },
  required: ["saturatedPositions", "saturatedCount"],
} as const;
/** Locate samples meeting an explicit sensor saturation rule without estimating true pressure above saturation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { samples, saturationLevel, equalitySaturated } = request;
  const compute = (): Output => {
    const saturatedPositions = samples.flatMap((x, i) =>
      (equalitySaturated ? x >= saturationLevel : x > saturationLevel)
        ? [i]
        : [],
    );
    return { saturatedPositions, saturatedCount: saturatedPositions.length };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { samples: [5, 10, 12], saturationLevel: 10, equalitySaturated: true },
  output: { saturatedPositions: [1, 2], saturatedCount: 2 },
} satisfies ToolExample<Input, Output>;
export const plantarPressureSaturatedSampleTokenTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "podiatry/plantar-pressure-saturated-sample-token",
      title: "Plantar Pressure Saturated Sample Token Tool",
      description:
        "Locate samples meeting an explicit sensor saturation rule without estimating true pressure above saturation.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          samples: { type: "array", maxItems: 256, items: { type: "number" } },
          saturationLevel: { type: "number" },
          equalitySaturated: { type: "boolean" },
        },
        required: ["samples", "saturationLevel", "equalitySaturated"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          saturatedPositions: {
            type: "array",
            maxItems: 256,
            items: { type: "integer" },
          },
          saturatedCount: { type: "integer" },
        },
        required: ["saturatedPositions", "saturatedCount"],
      },
      ports: {
        inputs: [
          {
            id: "samples",
            label: "Samples",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "saturationLevel",
            label: "Saturation Level",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "equalitySaturated",
            label: "Equality Saturated",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "saturatedPositions",
            label: "Saturated Positions",
            valueType: { type: "list", items: { type: "integer" } },
          },
          {
            id: "saturatedCount",
            label: "Saturated Count",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = plantarPressureSaturatedSampleTokenTool.execute;
export default plantarPressureSaturatedSampleTokenTool;
