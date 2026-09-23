import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly area: number;
  readonly thickness: number;
  readonly waterFraction: number;
};
export type Output = { readonly waterVolume: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    area: { type: "number", minimum: 0 },
    thickness: { type: "number", minimum: 0 },
    waterFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["area", "thickness", "waterFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { waterVolume: { type: "number" } },
  required: ["waterVolume"],
} as const;
/** Compute a supplied cell geometry/water-fraction term without treatment performance claims. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { area, thickness, waterFraction } = request;
  const compute = (): Output => {
    H.domain(area >= 0 && thickness >= 0);
    H.probability(waterFraction);
    return { waterVolume: area * thickness * waterFraction };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { area: 10, thickness: 2, waterFraction: 0.3 },
  output: { waterVolume: 6 },
} satisfies ToolExample<Input, Output>;
export const treatmentCellWaterVolumeTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioremediation/treatment-cell-water-volume-term",
    title: "Treatment Cell Water Volume Term Tool",
    description:
      "Compute a supplied cell geometry/water-fraction term without treatment performance claims.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        area: { type: "number", minimum: 0 },
        thickness: { type: "number", minimum: 0 },
        waterFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["area", "thickness", "waterFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { waterVolume: { type: "number" } },
      required: ["waterVolume"],
    },
    ports: {
      inputs: [
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
        {
          id: "waterFraction",
          label: "Water Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "waterVolume",
          label: "Water Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = treatmentCellWaterVolumeTermTool.execute;
export default treatmentCellWaterVolumeTermTool;
