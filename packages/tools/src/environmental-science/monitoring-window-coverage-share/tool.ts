import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly windowDuration: number;
  readonly coveredDurations: readonly number[];
  readonly suppliedOverlap: number;
};
export type Output = {
  readonly uniqueCovered: number;
  readonly coverage: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    windowDuration: { type: "number", exclusiveMinimum: 0 },
    coveredDurations: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    suppliedOverlap: { type: "number", minimum: 0 },
  },
  required: ["windowDuration", "coveredDurations", "suppliedOverlap"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    uniqueCovered: { type: "number" },
    coverage: { type: "number" },
  },
  required: ["uniqueCovered", "coverage"],
} as const;
/** Use a supplied total overlap correction for measured monitoring coverage, not a guessed interval union. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { windowDuration, coveredDurations, suppliedOverlap } = request;
  const compute = (): Output => {
    H.positive(windowDuration);
    H.domain(
      coveredDurations.every((x) => x >= 0) &&
        suppliedOverlap >= 0 &&
        suppliedOverlap <= coveredDurations.reduce((a, b) => a + b, 0) &&
        coveredDurations.reduce((a, b) => a + b, 0) - suppliedOverlap <=
          windowDuration,
    );
    return {
      uniqueCovered:
        coveredDurations.reduce((a, b) => a + b, 0) - suppliedOverlap,
      coverage:
        (coveredDurations.reduce((a, b) => a + b, 0) - suppliedOverlap) /
        windowDuration,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    windowDuration: 100,
    coveredDurations: [30, 40],
    suppliedOverlap: 10,
  },
  output: { uniqueCovered: 60, coverage: 0.6 },
} satisfies ToolExample<Input, Output>;
export const monitoringWindowCoverageShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-science/monitoring-window-coverage-share",
    title: "Monitoring Window Coverage Share Tool",
    description:
      "Use a supplied total overlap correction for measured monitoring coverage, not a guessed interval union.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        windowDuration: { type: "number", exclusiveMinimum: 0 },
        coveredDurations: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        suppliedOverlap: { type: "number", minimum: 0 },
      },
      required: ["windowDuration", "coveredDurations", "suppliedOverlap"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        uniqueCovered: { type: "number" },
        coverage: { type: "number" },
      },
      required: ["uniqueCovered", "coverage"],
    },
    ports: {
      inputs: [
        {
          id: "windowDuration",
          label: "Window Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "coveredDurations",
          label: "Covered Durations",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "suppliedOverlap",
          label: "Supplied Overlap",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "uniqueCovered",
          label: "Unique Covered",
          valueType: { type: "number" },
        },
        { id: "coverage", label: "Coverage", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = monitoringWindowCoverageShareTool.execute;
export default monitoringWindowCoverageShareTool;
