import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly ground: number; readonly scale: number };
export type Output = { readonly grid: number; readonly correction: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ground: { type: "number", minimum: 0 },
    scale: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["ground", "scale"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { grid: { type: "number" }, correction: { type: "number" } },
  required: ["grid", "correction"],
} as const;
/** Calculate cartographic ground grid scale term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ground, scale } = request;
  const compute = (): Output => {
    H.domain(ground >= 0);
    H.positive(scale);
    const grid = ground * scale;
    return { grid, correction: grid - ground };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { ground: 1000, scale: 0.9996 },
  output: { grid: 999.6, correction: -0.39999999999997726 },
} satisfies ToolExample<Input, Output>;
export const cartographicGroundGridScaleTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geography/cartographic-ground-grid-scale-term",
    title: "Cartographic Ground Grid Scale Term Tool",
    description:
      "Calculate cartographic ground grid scale term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ground: { type: "number", minimum: 0 },
        scale: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["ground", "scale"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { grid: { type: "number" }, correction: { type: "number" } },
      required: ["grid", "correction"],
    },
    ports: {
      inputs: [
        {
          id: "ground",
          label: "Ground",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "scale",
          label: "Scale",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "grid", label: "Grid", valueType: { type: "number" } },
        {
          id: "correction",
          label: "Correction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cartographicGroundGridScaleTermTool.execute;
export default cartographicGroundGridScaleTermTool;
