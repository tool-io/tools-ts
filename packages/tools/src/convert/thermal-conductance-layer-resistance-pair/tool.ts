import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly conductivity: number;
  readonly area: number;
  readonly thickness: number;
};
export type Output = {
  readonly conductance: number;
  readonly resistance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    conductivity: { type: "number", exclusiveMinimum: 0 },
    area: { type: "number", exclusiveMinimum: 0 },
    thickness: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["conductivity", "area", "thickness"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    conductance: { type: "number" },
    resistance: { type: "number" },
  },
  required: ["conductance", "resistance"],
} as const;
/** Return ideal uniform plane-layer thermal conductance and resistance without contact resistances. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { conductivity, area, thickness } = input;
  const compute = (): Output => {
    H.positive(conductivity);
    H.positive(area);
    H.positive(thickness);
    const conductance = (conductivity * area) / thickness;
    return { conductance, resistance: 1 / conductance };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { conductivity: 2, area: 3, thickness: 0.5 },
  output: { conductance: 12, resistance: 0.08333333333333333 },
} satisfies ToolExample<Input, Output>;
export const thermalConductanceLayerResistancePairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "convert/thermal-conductance-layer-resistance-pair",
      title: "Thermal Conductance Layer Resistance Pair Tool",
      description:
        "Return ideal uniform plane-layer thermal conductance and resistance without contact resistances.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          conductivity: { type: "number", exclusiveMinimum: 0 },
          area: { type: "number", exclusiveMinimum: 0 },
          thickness: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["conductivity", "area", "thickness"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          conductance: { type: "number" },
          resistance: { type: "number" },
        },
        required: ["conductance", "resistance"],
      },
      ports: {
        inputs: [
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
          {
            id: "thickness",
            label: "Thickness",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "conductance",
            label: "Conductance",
            valueType: { type: "number" },
          },
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
export const run = thermalConductanceLayerResistancePairTool.execute;
export default thermalConductanceLayerResistancePairTool;
