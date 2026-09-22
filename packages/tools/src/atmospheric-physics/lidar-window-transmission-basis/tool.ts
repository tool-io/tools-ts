import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measured: number;
  readonly oneWayTransmission: number;
  readonly passes: number;
};
export type Output = {
  readonly combinedTransmission: number;
  readonly corrected: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measured: { type: "number" },
    oneWayTransmission: { type: "number", exclusiveMinimum: 0, maximum: 1 },
    passes: { type: "integer", minimum: 1, maximum: 128 },
  },
  required: ["measured", "oneWayTransmission", "passes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    combinedTransmission: { type: "number" },
    corrected: { type: "number" },
  },
  required: ["combinedTransmission", "corrected"],
} as const;
/** Correct a supplied signal for explicitly counted traversals of a uniform transmitting window. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measured, oneWayTransmission, passes } = request;
  const compute = (): Output => {
    H.domain(oneWayTransmission > 0 && oneWayTransmission <= 1);
    H.integer(passes, 1, 128);
    return {
      combinedTransmission: oneWayTransmission ** passes,
      corrected: measured / oneWayTransmission ** passes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measured: 25, oneWayTransmission: 0.5, passes: 2 },
  output: { combinedTransmission: 0.25, corrected: 100 },
} satisfies ToolExample<Input, Output>;
export const lidarWindowTransmissionBasisTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "atmospheric-physics/lidar-window-transmission-basis",
    title: "Lidar Window Transmission Basis Tool",
    description:
      "Correct a supplied signal for explicitly counted traversals of a uniform transmitting window.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measured: { type: "number" },
        oneWayTransmission: { type: "number", exclusiveMinimum: 0, maximum: 1 },
        passes: { type: "integer", minimum: 1, maximum: 128 },
      },
      required: ["measured", "oneWayTransmission", "passes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        combinedTransmission: { type: "number" },
        corrected: { type: "number" },
      },
      required: ["combinedTransmission", "corrected"],
    },
    ports: {
      inputs: [
        {
          id: "measured",
          label: "Measured",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "oneWayTransmission",
          label: "One Way Transmission",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "passes",
          label: "Passes",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "combinedTransmission",
          label: "Combined Transmission",
          valueType: { type: "number" },
        },
        { id: "corrected", label: "Corrected", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = lidarWindowTransmissionBasisTool.execute;
export default lidarWindowTransmissionBasisTool;
