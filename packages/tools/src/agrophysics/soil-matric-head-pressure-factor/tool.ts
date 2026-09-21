import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly headMeters: number;
  readonly density: number;
  readonly gravity: number;
};
export type Output = { readonly pressurePa: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    headMeters: { type: "number" },
    density: { type: "number", exclusiveMinimum: 0 },
    gravity: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["headMeters", "density", "gravity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { pressurePa: { type: "number" } },
  required: ["pressurePa"],
} as const;
/** Signed pressure from a supplied hydraulic head with explicit density and gravity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { headMeters, density, gravity } = request;
  const compute = (): Output => {
    H.positive(density);
    H.positive(gravity);
    return { pressurePa: headMeters * density * gravity };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { headMeters: -1, density: 1000, gravity: 9.81 },
  output: { pressurePa: -9810 },
} satisfies ToolExample<Input, Output>;
export const soilMatricHeadPressureFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrophysics/soil-matric-head-pressure-factor",
    title: "Soil Matric Head Pressure Factor Tool",
    description:
      "Signed pressure from a supplied hydraulic head with explicit density and gravity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        headMeters: { type: "number" },
        density: { type: "number", exclusiveMinimum: 0 },
        gravity: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["headMeters", "density", "gravity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { pressurePa: { type: "number" } },
      required: ["pressurePa"],
    },
    ports: {
      inputs: [
        {
          id: "headMeters",
          label: "Head Meters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "density",
          label: "Density",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "gravity",
          label: "Gravity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "pressurePa",
          label: "Pressure Pa",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = soilMatricHeadPressureFactorTool.execute;
export default soilMatricHeadPressureFactorTool;
