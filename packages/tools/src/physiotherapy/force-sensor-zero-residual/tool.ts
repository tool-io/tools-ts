import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly signal: number;
  readonly suppliedZero: number;
  readonly suppliedGain: number;
  readonly referenceForce: number;
};
export type Output = {
  readonly correctedForce: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signal: { type: "number" },
    suppliedZero: { type: "number" },
    suppliedGain: { type: "number", exclusiveMinimum: 0 },
    referenceForce: { type: "number" },
  },
  required: ["signal", "suppliedZero", "suppliedGain", "referenceForce"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correctedForce: { type: "number" },
    residual: { type: "number" },
  },
  required: ["correctedForce", "residual"],
} as const;
/** Signed supplied bench force calibration against an explicit reference without therapeutic recommendations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { signal, suppliedZero, suppliedGain, referenceForce } = request;
  const compute = (): Output => {
    H.positive(suppliedGain);
    return {
      correctedForce: (signal - suppliedZero) * suppliedGain,
      residual: (signal - suppliedZero) * suppliedGain - referenceForce,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { signal: 12, suppliedZero: 2, suppliedGain: 0.5, referenceForce: 4 },
  output: { correctedForce: 5, residual: 1 },
} satisfies ToolExample<Input, Output>;
export const forceSensorZeroResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physiotherapy/force-sensor-zero-residual",
    title: "Force Sensor Zero Residual Tool",
    description:
      "Signed supplied bench force calibration against an explicit reference without therapeutic recommendations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signal: { type: "number" },
        suppliedZero: { type: "number" },
        suppliedGain: { type: "number", exclusiveMinimum: 0 },
        referenceForce: { type: "number" },
      },
      required: ["signal", "suppliedZero", "suppliedGain", "referenceForce"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        correctedForce: { type: "number" },
        residual: { type: "number" },
      },
      required: ["correctedForce", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "signal",
          label: "Signal",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedZero",
          label: "Supplied Zero",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedGain",
          label: "Supplied Gain",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceForce",
          label: "Reference Force",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "correctedForce",
          label: "Corrected Force",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = forceSensorZeroResidualTool.execute;
export default forceSensorZeroResidualTool;
