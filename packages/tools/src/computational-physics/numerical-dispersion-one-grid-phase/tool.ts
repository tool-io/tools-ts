import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly wavenumber: number; readonly spacing: number };
export type Output = {
  readonly gridPhase: number;
  readonly centeredDerivativeWavenumber: number;
  readonly ratio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wavenumber: { type: "number" },
    spacing: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["wavenumber", "spacing"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gridPhase: { type: "number" },
    centeredDerivativeWavenumber: { type: "number" },
    ratio: { type: "number" },
  },
  required: ["gridPhase", "centeredDerivativeWavenumber", "ratio"],
} as const;
/** Centered first-difference modified wavenumber sin(k*h)/h with the continuous zero-mode ratio. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wavenumber, spacing } = request;
  const compute = (): Output => {
    H.positive(spacing);
    return {
      gridPhase: wavenumber * spacing,
      centeredDerivativeWavenumber: Math.sin(wavenumber * spacing) / spacing,
      ratio:
        wavenumber === 0
          ? 1
          : Math.sin(wavenumber * spacing) / (wavenumber * spacing),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { wavenumber: 0, spacing: 0.1 },
  output: { gridPhase: 0, centeredDerivativeWavenumber: 0, ratio: 1 },
} satisfies ToolExample<Input, Output>;
export const numericalDispersionOneGridPhaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-physics/numerical-dispersion-one-grid-phase",
    title: "Numerical Dispersion One Grid Phase Tool",
    description:
      "Centered first-difference modified wavenumber sin(k*h)/h with the continuous zero-mode ratio.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wavenumber: { type: "number" },
        spacing: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["wavenumber", "spacing"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gridPhase: { type: "number" },
        centeredDerivativeWavenumber: { type: "number" },
        ratio: { type: "number" },
      },
      required: ["gridPhase", "centeredDerivativeWavenumber", "ratio"],
    },
    ports: {
      inputs: [
        {
          id: "wavenumber",
          label: "Wavenumber",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "spacing",
          label: "Spacing",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "gridPhase", label: "Grid Phase", valueType: { type: "number" } },
        {
          id: "centeredDerivativeWavenumber",
          label: "Centered Derivative Wavenumber",
          valueType: { type: "number" },
        },
        { id: "ratio", label: "Ratio", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = numericalDispersionOneGridPhaseTool.execute;
export default numericalDispersionOneGridPhaseTool;
