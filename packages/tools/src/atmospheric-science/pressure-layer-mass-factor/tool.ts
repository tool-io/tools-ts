import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bottomPressure: number;
  readonly topPressure: number;
  readonly gravity: number;
};
export type Output = { readonly massPerArea: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bottomPressure: { type: "number" },
    topPressure: { type: "number", minimum: 0 },
    gravity: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["bottomPressure", "topPressure", "gravity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { massPerArea: { type: "number" } },
  required: ["massPerArea"],
} as const;
/** Compute hydrostatic column mass per area from pressure thickness and supplied constant gravity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bottomPressure, topPressure, gravity } = request;
  const compute = (): Output => {
    H.domain(bottomPressure >= topPressure && topPressure >= 0);
    H.positive(gravity);
    return { massPerArea: (bottomPressure - topPressure) / gravity };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bottomPressure: 100000, topPressure: 90000, gravity: 10 },
  output: { massPerArea: 1000 },
} satisfies ToolExample<Input, Output>;
export const pressureLayerMassFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "atmospheric-science/pressure-layer-mass-factor",
    title: "Pressure Layer Mass Factor Tool",
    description:
      "Compute hydrostatic column mass per area from pressure thickness and supplied constant gravity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bottomPressure: { type: "number" },
        topPressure: { type: "number", minimum: 0 },
        gravity: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["bottomPressure", "topPressure", "gravity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { massPerArea: { type: "number" } },
      required: ["massPerArea"],
    },
    ports: {
      inputs: [
        {
          id: "bottomPressure",
          label: "Bottom Pressure",
          required: true,
          valueType: { type: "number", unit: "Pa" },
        },
        {
          id: "topPressure",
          label: "Top Pressure",
          required: true,
          valueType: { type: "number", unit: "Pa" },
        },
        {
          id: "gravity",
          label: "Gravity",
          required: true,
          valueType: { type: "number", unit: "m/s2" },
        },
      ],
      outputs: [
        {
          id: "massPerArea",
          label: "Mass Per Area",
          valueType: { type: "number", unit: "kg/m2" },
        },
      ],
    },
  },
  calculate,
});
export const run = pressureLayerMassFactorTool.execute;
export default pressureLayerMassFactorTool;
