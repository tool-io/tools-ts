import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly south: number; readonly north: number };
export type Output = {
  readonly midLatitude: number;
  readonly halfWidth: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    south: { type: "number", minimum: -90 },
    north: { type: "number", maximum: 90 },
  },
  required: ["south", "north"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    midLatitude: { type: "number" },
    halfWidth: { type: "number" },
  },
  required: ["midLatitude", "halfWidth"],
} as const;
/** Arithmetic center of supplied latitude bounds, not an equal-area spherical centroid. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { south, north } = request;
  const compute = (): Output => {
    H.domain(south >= -90 && north <= 90 && south <= north);
    return { midLatitude: (south + north) / 2, halfWidth: (north - south) / 2 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { south: -20, north: 40 },
  output: { midLatitude: 10, halfWidth: 30 },
} satisfies ToolExample<Input, Output>;
export const latitudeBandCenterTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "geography/latitude-band-center",
    title: "Latitude Band Center Tool",
    description:
      "Arithmetic center of supplied latitude bounds, not an equal-area spherical centroid.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        south: { type: "number", minimum: -90 },
        north: { type: "number", maximum: 90 },
      },
      required: ["south", "north"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        midLatitude: { type: "number" },
        halfWidth: { type: "number" },
      },
      required: ["midLatitude", "halfWidth"],
    },
    ports: {
      inputs: [
        {
          id: "south",
          label: "South",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "north",
          label: "North",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "midLatitude",
          label: "Mid Latitude",
          valueType: { type: "number" },
        },
        { id: "halfWidth", label: "Half Width", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = latitudeBandCenterTool.execute;
export default latitudeBandCenterTool;
