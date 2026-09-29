import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly thickness: number;
  readonly conductivity: number;
  readonly area: number;
};
export type Output = { readonly resistance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    thickness: { type: "number", minimum: 0 },
    conductivity: { type: "number", exclusiveMinimum: 0 },
    area: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["thickness", "conductivity", "area"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { resistance: { type: "number" } },
  required: ["resistance"],
} as const;
/** Calculate darcy series layer resistance term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { thickness, conductivity, area } = request;
  const compute = (): Output => {
    H.domain(thickness >= 0);
    H.positive(conductivity);
    H.positive(area);
    return { resistance: thickness / (conductivity * area) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { thickness: 2, conductivity: 0.01, area: 10 },
  output: { resistance: 20 },
} satisfies ToolExample<Input, Output>;
export const darcySeriesLayerResistanceTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrology/darcy-series-layer-resistance-term",
    title: "Darcy Series Layer Resistance Term Tool",
    description:
      "Calculate darcy series layer resistance term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        thickness: { type: "number", minimum: 0 },
        conductivity: { type: "number", exclusiveMinimum: 0 },
        area: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["thickness", "conductivity", "area"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { resistance: { type: "number" } },
      required: ["resistance"],
    },
    ports: {
      inputs: [
        {
          id: "thickness",
          label: "Thickness",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "conductivity",
          label: "Conductivity",
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
          id: "resistance",
          label: "Resistance",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = darcySeriesLayerResistanceTermTool.execute;
export default darcySeriesLayerResistanceTermTool;
