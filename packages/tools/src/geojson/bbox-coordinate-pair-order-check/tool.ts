import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bbox: readonly number[];
  readonly allowAntimeridian: boolean;
};
export type Output = { readonly ordered: boolean; readonly crossing: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bbox: { type: "array", maxItems: 256, items: { type: "number" } },
    allowAntimeridian: { type: "boolean" },
  },
  required: ["bbox", "allowAntimeridian"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ordered: { type: "boolean" }, crossing: { type: "boolean" } },
  required: ["ordered", "crossing"],
} as const;
/** Calculate bbox coordinate pair order check from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bbox, allowAntimeridian } = request;
  const compute = (): Output => {
    H.domain(bbox.length >= 4 && bbox.length % 2 === 0);
    const n = bbox.length / 2,
      crossing = bbox[0] > bbox[n];
    return {
      ordered: bbox
        .slice(0, n)
        .every((x, i) => x <= bbox[n + i] || (i === 0 && allowAntimeridian)),
      crossing,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bbox: [170, -10, -170, 10], allowAntimeridian: true },
  output: { ordered: true, crossing: true },
} satisfies ToolExample<Input, Output>;
export const bboxCoordinatePairOrderCheckTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geojson/bbox-coordinate-pair-order-check",
    title: "Bbox Coordinate Pair Order Check Tool",
    description:
      "Calculate bbox coordinate pair order check from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bbox: { type: "array", maxItems: 256, items: { type: "number" } },
        allowAntimeridian: { type: "boolean" },
      },
      required: ["bbox", "allowAntimeridian"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ordered: { type: "boolean" },
        crossing: { type: "boolean" },
      },
      required: ["ordered", "crossing"],
    },
    ports: {
      inputs: [
        {
          id: "bbox",
          label: "Bbox",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "allowAntimeridian",
          label: "Allow Antimeridian",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "ordered", label: "Ordered", valueType: { type: "boolean" } },
        { id: "crossing", label: "Crossing", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = bboxCoordinatePairOrderCheckTool.execute;
export default bboxCoordinatePairOrderCheckTool;
