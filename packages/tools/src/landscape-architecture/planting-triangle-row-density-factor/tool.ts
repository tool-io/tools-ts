import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly spacing: number; readonly area: number };
export type Output = {
  readonly rowSpacing: number;
  readonly density: number;
  readonly approximatePlants: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    spacing: { type: "number", exclusiveMinimum: 0 },
    area: { type: "number", minimum: 0 },
  },
  required: ["spacing", "area"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rowSpacing: { type: "number" },
    density: { type: "number" },
    approximatePlants: { type: "number" },
  },
  required: ["rowSpacing", "density", "approximatePlants"],
} as const;
/** Equilateral triangular planting lattice, ignoring bed boundaries. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { spacing, area } = request;
  const compute = (): Output => {
    H.positive(spacing);
    H.domain(area >= 0);
    return {
      rowSpacing: (spacing * Math.sqrt(3)) / 2,
      density: 2 / (Math.sqrt(3) * spacing ** 2),
      approximatePlants: (2 * area) / (Math.sqrt(3) * spacing ** 2),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { spacing: 2, area: 40 },
  output: {
    rowSpacing: 1.7320508075688772,
    density: 0.2886751345948129,
    approximatePlants: 11.547005383792516,
  },
} satisfies ToolExample<Input, Output>;
export const plantingTriangleRowDensityFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "landscape-architecture/planting-triangle-row-density-factor",
    title: "Planting Triangle Row Density Factor Tool",
    description:
      "Equilateral triangular planting lattice, ignoring bed boundaries.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        spacing: { type: "number", exclusiveMinimum: 0 },
        area: { type: "number", minimum: 0 },
      },
      required: ["spacing", "area"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rowSpacing: { type: "number" },
        density: { type: "number" },
        approximatePlants: { type: "number" },
      },
      required: ["rowSpacing", "density", "approximatePlants"],
    },
    ports: {
      inputs: [
        {
          id: "spacing",
          label: "Spacing",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "area",
          label: "Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "rowSpacing",
          label: "Row Spacing",
          valueType: { type: "number" },
        },
        { id: "density", label: "Density", valueType: { type: "number" } },
        {
          id: "approximatePlants",
          label: "Approximate Plants",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = plantingTriangleRowDensityFactorTool.execute;
export default plantingTriangleRowDensityFactorTool;
