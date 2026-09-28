import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly position: readonly number[] };
export type Output = {
  readonly dimensions: number;
  readonly hasThirdOrdinate: boolean;
  readonly extraOrdinateCount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    position: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["position"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dimensions: { type: "integer" },
    hasThirdOrdinate: { type: "boolean" },
    extraOrdinateCount: { type: "integer" },
  },
  required: ["dimensions", "hasThirdOrdinate", "extraOrdinateCount"],
} as const;
/** Inspect supplied position ordinate count without assigning meaning to ordinates beyond the optional third. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { position } = request;
  const compute = (): Output => {
    H.domain(position.length >= 2);
    return {
      dimensions: position.length,
      hasThirdOrdinate: position.length >= 3,
      extraOrdinateCount: Math.max(0, position.length - 3),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { position: [10, 20, 5] },
  output: { dimensions: 3, hasThirdOrdinate: true, extraOrdinateCount: 0 },
} satisfies ToolExample<Input, Output>;
export const positionDimensionCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geojson/position-dimension-count",
    title: "Position Dimension Count Tool",
    description:
      "Inspect supplied position ordinate count without assigning meaning to ordinates beyond the optional third.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        position: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["position"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dimensions: { type: "integer" },
        hasThirdOrdinate: { type: "boolean" },
        extraOrdinateCount: { type: "integer" },
      },
      required: ["dimensions", "hasThirdOrdinate", "extraOrdinateCount"],
    },
    ports: {
      inputs: [
        {
          id: "position",
          label: "Position",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "dimensions",
          label: "Dimensions",
          valueType: { type: "integer" },
        },
        {
          id: "hasThirdOrdinate",
          label: "Has Third Ordinate",
          valueType: { type: "boolean" },
        },
        {
          id: "extraOrdinateCount",
          label: "Extra Ordinate Count",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = positionDimensionCountTool.execute;
export default positionDimensionCountTool;
