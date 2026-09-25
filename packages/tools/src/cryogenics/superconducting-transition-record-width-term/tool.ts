import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lowerCrossingTemperature: number;
  readonly upperCrossingTemperature: number;
  readonly midpointReference: number;
};
export type Output = {
  readonly width: number;
  readonly midpoint: number;
  readonly midpointGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerCrossingTemperature: { type: "number", minimum: 0 },
    upperCrossingTemperature: { type: "number" },
    midpointReference: { type: "number" },
  },
  required: [
    "lowerCrossingTemperature",
    "upperCrossingTemperature",
    "midpointReference",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    width: { type: "number" },
    midpoint: { type: "number" },
    midpointGap: { type: "number" },
  },
  required: ["width", "midpoint", "midpointGap"],
} as const;
/** Crossing temperatures must already come from caller-selected transition criteria; no critical-temperature detection is performed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    lowerCrossingTemperature,
    upperCrossingTemperature,
    midpointReference,
  } = request;
  const compute = (): Output => {
    H.domain(
      lowerCrossingTemperature >= 0 &&
        upperCrossingTemperature >= lowerCrossingTemperature,
    );
    return {
      width: upperCrossingTemperature - lowerCrossingTemperature,
      midpoint: (lowerCrossingTemperature + upperCrossingTemperature) / 2,
      midpointGap:
        (lowerCrossingTemperature + upperCrossingTemperature) / 2 -
        midpointReference,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    lowerCrossingTemperature: 8,
    upperCrossingTemperature: 10,
    midpointReference: 9.5,
  },
  output: { width: 2, midpoint: 9, midpointGap: -0.5 },
} satisfies ToolExample<Input, Output>;
export const superconductingTransitionRecordWidthTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "cryogenics/superconducting-transition-record-width-term",
      title: "Superconducting Transition Record Width Term Tool",
      description:
        "Crossing temperatures must already come from caller-selected transition criteria; no critical-temperature detection is performed.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          lowerCrossingTemperature: { type: "number", minimum: 0 },
          upperCrossingTemperature: { type: "number" },
          midpointReference: { type: "number" },
        },
        required: [
          "lowerCrossingTemperature",
          "upperCrossingTemperature",
          "midpointReference",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          width: { type: "number" },
          midpoint: { type: "number" },
          midpointGap: { type: "number" },
        },
        required: ["width", "midpoint", "midpointGap"],
      },
      ports: {
        inputs: [
          {
            id: "lowerCrossingTemperature",
            label: "Lower Crossing Temperature",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "upperCrossingTemperature",
            label: "Upper Crossing Temperature",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "midpointReference",
            label: "Midpoint Reference",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "width", label: "Width", valueType: { type: "number" } },
          { id: "midpoint", label: "Midpoint", valueType: { type: "number" } },
          {
            id: "midpointGap",
            label: "Midpoint Gap",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = superconductingTransitionRecordWidthTermTool.execute;
export default superconductingTransitionRecordWidthTermTool;
