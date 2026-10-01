import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly samples: readonly number[];
  readonly lowerRail: number;
  readonly upperRail: number;
  readonly equalityCounts: boolean;
};
export type Output = {
  readonly saturated: number;
  readonly fraction: number;
  readonly longestRun: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    samples: { type: "array", maxItems: 256, items: { type: "number" } },
    lowerRail: { type: "number" },
    upperRail: { type: "number" },
    equalityCounts: { type: "boolean" },
  },
  required: ["samples", "lowerRail", "upperRail", "equalityCounts"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    saturated: { type: "integer" },
    fraction: { type: "number" },
    longestRun: { type: "integer" },
  },
  required: ["saturated", "fraction", "longestRun"],
} as const;
/** Rail-level sample and longest-run audit using explicit bounds and equality policy, without inferring signal artifacts from device-independent thresholds. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { samples, lowerRail, upperRail, equalityCounts } = request;
  const compute = (): Output => {
    H.domain(samples.length > 0 && upperRail > lowerRail);
    const flags = samples.map((x) =>
      equalityCounts
        ? x <= lowerRail || x >= upperRail
        : x < lowerRail || x > upperRail,
    );
    let longestRun = 0,
      run = 0;
    for (const flag of flags) {
      run = flag ? run + 1 : 0;
      longestRun = Math.max(longestRun, run);
    }
    const saturated = flags.filter(Boolean).length;
    return { saturated, fraction: saturated / samples.length, longestRun };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    samples: [0, 1, 10, 10, 5],
    lowerRail: 0,
    upperRail: 10,
    equalityCounts: true,
  },
  output: { saturated: 3, fraction: 0.6, longestRun: 2 },
} satisfies ToolExample<Input, Output>;
export const neurologicTraceSaturationSampleCountTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "neurology/neurologic-trace-saturation-sample-count",
      title: "Neurologic Trace Saturation Sample Count Tool",
      description:
        "Rail-level sample and longest-run audit using explicit bounds and equality policy, without inferring signal artifacts from device-independent thresholds.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          samples: { type: "array", maxItems: 256, items: { type: "number" } },
          lowerRail: { type: "number" },
          upperRail: { type: "number" },
          equalityCounts: { type: "boolean" },
        },
        required: ["samples", "lowerRail", "upperRail", "equalityCounts"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          saturated: { type: "integer" },
          fraction: { type: "number" },
          longestRun: { type: "integer" },
        },
        required: ["saturated", "fraction", "longestRun"],
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
            id: "lowerRail",
            label: "Lower Rail",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "upperRail",
            label: "Upper Rail",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "equalityCounts",
            label: "Equality Counts",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "saturated",
            label: "Saturated",
            valueType: { type: "integer" },
          },
          { id: "fraction", label: "Fraction", valueType: { type: "number" } },
          {
            id: "longestRun",
            label: "Longest Run",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = neurologicTraceSaturationSampleCountTool.execute;
export default neurologicTraceSaturationSampleCountTool;
