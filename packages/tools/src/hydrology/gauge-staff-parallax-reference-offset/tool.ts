import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedReading: number;
  readonly referenceReading: number;
  readonly independentWaterElevation: number;
};
export type Output = {
  readonly readingError: number;
  readonly correctedGaugeZero: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedReading: { type: "number" },
    referenceReading: { type: "number" },
    independentWaterElevation: { type: "number" },
  },
  required: [
    "observedReading",
    "referenceReading",
    "independentWaterElevation",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    readingError: { type: "number" },
    correctedGaugeZero: { type: "number" },
  },
  required: ["readingError", "correctedGaugeZero"],
} as const;
/** Compare observed and reference staff readings; no parallax-angle model or correction of the independent elevation is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedReading, referenceReading, independentWaterElevation } =
    request;
  const compute = (): Output => {
    return {
      readingError: observedReading - referenceReading,
      correctedGaugeZero: independentWaterElevation - referenceReading,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    observedReading: 2.4,
    referenceReading: 2.3,
    independentWaterElevation: 102.3,
  },
  output: { readingError: 0.10000000000000009, correctedGaugeZero: 100 },
} satisfies ToolExample<Input, Output>;
export const gaugeStaffParallaxReferenceOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrology/gauge-staff-parallax-reference-offset",
    title: "Gauge Staff Parallax Reference Offset Tool",
    description:
      "Compare observed and reference staff readings; no parallax-angle model or correction of the independent elevation is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedReading: { type: "number" },
        referenceReading: { type: "number" },
        independentWaterElevation: { type: "number" },
      },
      required: [
        "observedReading",
        "referenceReading",
        "independentWaterElevation",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        readingError: { type: "number" },
        correctedGaugeZero: { type: "number" },
      },
      required: ["readingError", "correctedGaugeZero"],
    },
    ports: {
      inputs: [
        {
          id: "observedReading",
          label: "Observed Reading",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceReading",
          label: "Reference Reading",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "independentWaterElevation",
          label: "Independent Water Elevation",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "readingError",
          label: "Reading Error",
          valueType: { type: "number" },
        },
        {
          id: "correctedGaugeZero",
          label: "Corrected Gauge Zero",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = gaugeStaffParallaxReferenceOffsetTool.execute;
export default gaugeStaffParallaxReferenceOffsetTool;
