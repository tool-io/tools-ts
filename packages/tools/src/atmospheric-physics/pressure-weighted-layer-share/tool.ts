import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly layerPressureThickness: number;
  readonly totalPressureThickness: number;
};
export type Output = { readonly share: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    layerPressureThickness: { type: "number", minimum: 0 },
    totalPressureThickness: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["layerPressureThickness", "totalPressureThickness"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" } },
  required: ["share"],
} as const;
/** Calculate pressure weighted layer share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { layerPressureThickness, totalPressureThickness } = request;
  const compute = (): Output => {
    H.positive(totalPressureThickness);
    H.domain(
      layerPressureThickness >= 0 &&
        layerPressureThickness <= totalPressureThickness,
    );
    return { share: layerPressureThickness / totalPressureThickness };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { layerPressureThickness: 20, totalPressureThickness: 100 },
  output: { share: 0.2 },
} satisfies ToolExample<Input, Output>;
export const pressureWeightedLayerShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "atmospheric-physics/pressure-weighted-layer-share",
    title: "Pressure Weighted Layer Share Tool",
    description:
      "Calculate pressure weighted layer share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        layerPressureThickness: { type: "number", minimum: 0 },
        totalPressureThickness: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["layerPressureThickness", "totalPressureThickness"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { share: { type: "number" } },
      required: ["share"],
    },
    ports: {
      inputs: [
        {
          id: "layerPressureThickness",
          label: "Layer Pressure Thickness",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalPressureThickness",
          label: "Total Pressure Thickness",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "share", label: "Share", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = pressureWeightedLayerShareTool.execute;
export default pressureWeightedLayerShareTool;
