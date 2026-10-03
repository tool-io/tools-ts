import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly inspirationSeconds: number;
  readonly expirationSeconds: number;
  readonly pauseSeconds: number;
};
export type Output = {
  readonly cycleSeconds: number;
  readonly ieRatio: number;
  readonly inspiratoryFraction: number;
  readonly breathsPerMinute: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inspirationSeconds: { type: "number", minimum: 0 },
    expirationSeconds: { type: "number", exclusiveMinimum: 0 },
    pauseSeconds: { type: "number", minimum: 0 },
  },
  required: ["inspirationSeconds", "expirationSeconds", "pauseSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cycleSeconds: { type: "number" },
    ieRatio: { type: "number" },
    inspiratoryFraction: { type: "number" },
    breathsPerMinute: { type: "number" },
  },
  required: [
    "cycleSeconds",
    "ieRatio",
    "inspiratoryFraction",
    "breathsPerMinute",
  ],
} as const;
/** Supplied phase-duration arithmetic with pause time kept separate, without selecting ventilation settings or normal ranges. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { inspirationSeconds, expirationSeconds, pauseSeconds } = request;
  const compute = (): Output => {
    H.domain(inspirationSeconds >= 0 && pauseSeconds >= 0);
    H.positive(expirationSeconds);
    return {
      cycleSeconds: inspirationSeconds + expirationSeconds + pauseSeconds,
      ieRatio: inspirationSeconds / expirationSeconds,
      inspiratoryFraction:
        inspirationSeconds /
        (inspirationSeconds + expirationSeconds + pauseSeconds),
      breathsPerMinute:
        60 / (inspirationSeconds + expirationSeconds + pauseSeconds),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { inspirationSeconds: 1, expirationSeconds: 2, pauseSeconds: 1 },
  output: {
    cycleSeconds: 4,
    ieRatio: 0.5,
    inspiratoryFraction: 0.25,
    breathsPerMinute: 15,
  },
} satisfies ToolExample<Input, Output>;
export const respiratoryCycleInspiratoryExpiratoryRatioTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "pulmonology/respiratory-cycle-inspiratory-expiratory-ratio",
      title: "Respiratory Cycle Inspiratory Expiratory Ratio Tool",
      description:
        "Supplied phase-duration arithmetic with pause time kept separate, without selecting ventilation settings or normal ranges.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          inspirationSeconds: { type: "number", minimum: 0 },
          expirationSeconds: { type: "number", exclusiveMinimum: 0 },
          pauseSeconds: { type: "number", minimum: 0 },
        },
        required: ["inspirationSeconds", "expirationSeconds", "pauseSeconds"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          cycleSeconds: { type: "number" },
          ieRatio: { type: "number" },
          inspiratoryFraction: { type: "number" },
          breathsPerMinute: { type: "number" },
        },
        required: [
          "cycleSeconds",
          "ieRatio",
          "inspiratoryFraction",
          "breathsPerMinute",
        ],
      },
      ports: {
        inputs: [
          {
            id: "inspirationSeconds",
            label: "Inspiration Seconds",
            required: true,
            valueType: { type: "number", unit: "s" },
          },
          {
            id: "expirationSeconds",
            label: "Expiration Seconds",
            required: true,
            valueType: { type: "number", unit: "s" },
          },
          {
            id: "pauseSeconds",
            label: "Pause Seconds",
            required: true,
            valueType: { type: "number", unit: "s" },
          },
        ],
        outputs: [
          {
            id: "cycleSeconds",
            label: "Cycle Seconds",
            valueType: { type: "number", unit: "s" },
          },
          { id: "ieRatio", label: "Ie Ratio", valueType: { type: "number" } },
          {
            id: "inspiratoryFraction",
            label: "Inspiratory Fraction",
            valueType: { type: "number" },
          },
          {
            id: "breathsPerMinute",
            label: "Breaths Per Minute",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = respiratoryCycleInspiratoryExpiratoryRatioTool.execute;
export default respiratoryCycleInspiratoryExpiratoryRatioTool;
