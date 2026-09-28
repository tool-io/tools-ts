import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedGravity: number;
  readonly tideSignal: number;
  readonly driftCorrection: number;
};
export type Output = {
  readonly tideRemoved: number;
  readonly corrected: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedGravity: { type: "number" },
    tideSignal: { type: "number" },
    driftCorrection: { type: "number" },
  },
  required: ["observedGravity", "tideSignal", "driftCorrection"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tideRemoved: { type: "number" },
    corrected: { type: "number" },
  },
  required: ["tideRemoved", "corrected"],
} as const;
/** Subtract a supplied gravity tide signal and add a supplied drift correction, in identical gravity units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedGravity, tideSignal, driftCorrection } = request;
  const compute = (): Output => {
    return {
      tideRemoved: observedGravity - tideSignal,
      corrected: observedGravity - tideSignal + driftCorrection,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedGravity: 100, tideSignal: 0.2, driftCorrection: 0.1 },
  output: { tideRemoved: 99.8, corrected: 99.89999999999999 },
} satisfies ToolExample<Input, Output>;
export const gravityTidalSuppliedCorrectionTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geophysics/gravity-tidal-supplied-correction-term",
    title: "Gravity Tidal Supplied Correction Term Tool",
    description:
      "Subtract a supplied gravity tide signal and add a supplied drift correction, in identical gravity units.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedGravity: { type: "number" },
        tideSignal: { type: "number" },
        driftCorrection: { type: "number" },
      },
      required: ["observedGravity", "tideSignal", "driftCorrection"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tideRemoved: { type: "number" },
        corrected: { type: "number" },
      },
      required: ["tideRemoved", "corrected"],
    },
    ports: {
      inputs: [
        {
          id: "observedGravity",
          label: "Observed Gravity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tideSignal",
          label: "Tide Signal",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "driftCorrection",
          label: "Drift Correction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "tideRemoved",
          label: "Tide Removed",
          valueType: { type: "number" },
        },
        { id: "corrected", label: "Corrected", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = gravityTidalSuppliedCorrectionTermTool.execute;
export default gravityTidalSuppliedCorrectionTermTool;
