import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly scheduled: number;
  readonly missing: number;
  readonly excluded: number;
  readonly overlap: number;
};
export type Output = { readonly covered: number; readonly fraction: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scheduled: { type: "number", exclusiveMinimum: 0 },
    missing: { type: "number", minimum: 0 },
    excluded: { type: "number", minimum: 0 },
    overlap: { type: "number", minimum: 0 },
  },
  required: ["scheduled", "missing", "excluded", "overlap"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { covered: { type: "number" }, fraction: { type: "number" } },
  required: ["covered", "fraction"],
} as const;
/** Calculate monitoring effort covered fraction from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { scheduled, missing, excluded, overlap } = request;
  const compute = (): Output => {
    H.positive(scheduled);
    H.domain(
      missing >= 0 &&
        excluded >= 0 &&
        overlap >= 0 &&
        overlap <= Math.min(missing, excluded) &&
        missing + excluded - overlap <= scheduled,
    );
    return {
      covered: scheduled - missing - excluded + overlap,
      fraction: (scheduled - missing - excluded + overlap) / scheduled,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { scheduled: 100, missing: 20, excluded: 10, overlap: 5 },
  output: { covered: 75, fraction: 0.75 },
} satisfies ToolExample<Input, Output>;
export const monitoringEffortCoveredFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-science/monitoring-effort-covered-fraction",
    title: "Monitoring Effort Covered Fraction Tool",
    description:
      "Calculate monitoring effort covered fraction from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scheduled: { type: "number", exclusiveMinimum: 0 },
        missing: { type: "number", minimum: 0 },
        excluded: { type: "number", minimum: 0 },
        overlap: { type: "number", minimum: 0 },
      },
      required: ["scheduled", "missing", "excluded", "overlap"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { covered: { type: "number" }, fraction: { type: "number" } },
      required: ["covered", "fraction"],
    },
    ports: {
      inputs: [
        {
          id: "scheduled",
          label: "Scheduled",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "missing",
          label: "Missing",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excluded",
          label: "Excluded",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "overlap",
          label: "Overlap",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "covered", label: "Covered", valueType: { type: "number" } },
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = monitoringEffortCoveredFractionTool.execute;
export default monitoringEffortCoveredFractionTool;
