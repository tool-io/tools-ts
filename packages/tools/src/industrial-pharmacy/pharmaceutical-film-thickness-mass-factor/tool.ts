import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dryMass: number;
  readonly area: number;
  readonly density: number;
  readonly layers: number;
};
export type Output = {
  readonly totalThickness: number;
  readonly thicknessPerLayer: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dryMass: { type: "number", minimum: 0 },
    area: { type: "number", exclusiveMinimum: 0 },
    density: { type: "number", exclusiveMinimum: 0 },
    layers: { type: "integer", minimum: 1 },
  },
  required: ["dryMass", "area", "density", "layers"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalThickness: { type: "number" },
    thicknessPerLayer: { type: "number" },
  },
  required: ["totalThickness", "thicknessPerLayer"],
} as const;
/** Calculate pharmaceutical film thickness mass factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dryMass, area, density, layers } = request;
  const compute = (): Output => {
    H.domain(dryMass >= 0);
    H.positive(area);
    H.positive(density);
    H.integer(layers, 1);
    return {
      totalThickness: dryMass / (area * density),
      thicknessPerLayer: dryMass / (area * density * layers),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dryMass: 10, area: 100, density: 2, layers: 2 },
  output: { totalThickness: 0.05, thicknessPerLayer: 0.025 },
} satisfies ToolExample<Input, Output>;
export const pharmaceuticalFilmThicknessMassFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "industrial-pharmacy/pharmaceutical-film-thickness-mass-factor",
      title: "Pharmaceutical Film Thickness Mass Factor Tool",
      description:
        "Calculate pharmaceutical film thickness mass factor from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          dryMass: { type: "number", minimum: 0 },
          area: { type: "number", exclusiveMinimum: 0 },
          density: { type: "number", exclusiveMinimum: 0 },
          layers: { type: "integer", minimum: 1 },
        },
        required: ["dryMass", "area", "density", "layers"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          totalThickness: { type: "number" },
          thicknessPerLayer: { type: "number" },
        },
        required: ["totalThickness", "thicknessPerLayer"],
      },
      ports: {
        inputs: [
          {
            id: "dryMass",
            label: "Dry Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "area",
            label: "Area",
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
            id: "layers",
            label: "Layers",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "totalThickness",
            label: "Total Thickness",
            valueType: { type: "number" },
          },
          {
            id: "thicknessPerLayer",
            label: "Thickness Per Layer",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = pharmaceuticalFilmThicknessMassFactorTool.execute;
export default pharmaceuticalFilmThicknessMassFactorTool;
