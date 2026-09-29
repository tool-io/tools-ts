import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly temperature: number;
  readonly snowThreshold: number;
  readonly rainThreshold: number;
};
export type Output = {
  readonly coldMargin: number;
  readonly warmMargin: number;
  readonly category: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    temperature: { type: "number" },
    snowThreshold: { type: "number" },
    rainThreshold: { type: "number" },
  },
  required: ["temperature", "snowThreshold", "rainThreshold"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coldMargin: { type: "number" },
    warmMargin: { type: "number" },
    category: { type: "string", maxLength: 8192 },
  },
  required: ["coldMargin", "warmMargin", "category"],
} as const;
/** Apply supplied temperature thresholds as descriptive bins; no precipitation-phase diagnosis or physical transition model is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { temperature, snowThreshold, rainThreshold } = request;
  const compute = (): Output => {
    H.domain(rainThreshold > snowThreshold);
    return {
      coldMargin: temperature - snowThreshold,
      warmMargin: temperature - rainThreshold,
      category:
        temperature <= snowThreshold
          ? "snow-side"
          : temperature >= rainThreshold
            ? "rain-side"
            : "transition",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { temperature: 1, snowThreshold: 0, rainThreshold: 2 },
  output: { coldMargin: 1, warmMargin: -1, category: "transition" },
} satisfies ToolExample<Input, Output>;
export const precipitationPhaseExplicitThresholdGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "hydrometeorology/precipitation-phase-explicit-threshold-gap",
      title: "Precipitation Phase Explicit Threshold Gap Tool",
      description:
        "Apply supplied temperature thresholds as descriptive bins; no precipitation-phase diagnosis or physical transition model is inferred.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          temperature: { type: "number" },
          snowThreshold: { type: "number" },
          rainThreshold: { type: "number" },
        },
        required: ["temperature", "snowThreshold", "rainThreshold"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          coldMargin: { type: "number" },
          warmMargin: { type: "number" },
          category: { type: "string", maxLength: 8192 },
        },
        required: ["coldMargin", "warmMargin", "category"],
      },
      ports: {
        inputs: [
          {
            id: "temperature",
            label: "Temperature",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "snowThreshold",
            label: "Snow Threshold",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "rainThreshold",
            label: "Rain Threshold",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "coldMargin",
            label: "Cold Margin",
            valueType: { type: "number" },
          },
          {
            id: "warmMargin",
            label: "Warm Margin",
            valueType: { type: "number" },
          },
          { id: "category", label: "Category", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = precipitationPhaseExplicitThresholdGapTool.execute;
export default precipitationPhaseExplicitThresholdGapTool;
