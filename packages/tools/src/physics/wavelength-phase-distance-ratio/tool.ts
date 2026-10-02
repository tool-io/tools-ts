import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly distance: number; readonly wavelength: number };
export type Output = { readonly cycles: number; readonly phaseRadians: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distance: { type: "number" },
    wavelength: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["distance", "wavelength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { cycles: { type: "number" }, phaseRadians: { type: "number" } },
  required: ["cycles", "phaseRadians"],
} as const;
/** Calculate wavelength phase distance ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { distance, wavelength } = request;
  const compute = (): Output => {
    H.positive(wavelength);
    return {
      cycles: distance / wavelength,
      phaseRadians: 2 * Math.PI * (distance / wavelength),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { distance: 3, wavelength: 2 },
  output: { cycles: 1.5, phaseRadians: 9.42477796076938 },
} satisfies ToolExample<Input, Output>;
export const wavelengthPhaseDistanceRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physics/wavelength-phase-distance-ratio",
    title: "Wavelength Phase Distance Ratio Tool",
    description:
      "Calculate wavelength phase distance ratio from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        distance: { type: "number" },
        wavelength: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["distance", "wavelength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cycles: { type: "number" },
        phaseRadians: { type: "number" },
      },
      required: ["cycles", "phaseRadians"],
    },
    ports: {
      inputs: [
        {
          id: "distance",
          label: "Distance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "wavelength",
          label: "Wavelength",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "cycles", label: "Cycles", valueType: { type: "number" } },
        {
          id: "phaseRadians",
          label: "Phase Radians",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = wavelengthPhaseDistanceRatioTool.execute;
export default wavelengthPhaseDistanceRatioTool;
