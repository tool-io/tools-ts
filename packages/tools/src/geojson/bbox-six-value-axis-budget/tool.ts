import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly bbox: readonly number[] };
export type Output = {
  readonly longitudeSpan: number;
  readonly latitudeSpan: number;
  readonly verticalSpan: number;
  readonly crossesAntimeridian: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bbox: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["bbox"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    longitudeSpan: { type: "number" },
    latitudeSpan: { type: "number" },
    verticalSpan: { type: "number" },
    crossesAntimeridian: { type: "boolean" },
  },
  required: [
    "longitudeSpan",
    "latitudeSpan",
    "verticalSpan",
    "crossesAntimeridian",
  ],
} as const;
/** Axis spans of a six-value longitude/latitude/height bounding box, allowing an antimeridian crossing. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bbox } = request;
  const compute = (): Output => {
    H.domain(
      bbox.length === 6 &&
        bbox[0] >= -180 &&
        bbox[0] <= 180 &&
        bbox[3] >= -180 &&
        bbox[3] <= 180 &&
        bbox[1] >= -90 &&
        bbox[1] <= 90 &&
        bbox[4] >= -90 &&
        bbox[4] <= 90 &&
        bbox[4] >= bbox[1] &&
        bbox[5] >= bbox[2],
    );
    const crossesAntimeridian = bbox[3] < bbox[0];
    return {
      longitudeSpan: bbox[3] - bbox[0] + (crossesAntimeridian ? 360 : 0),
      latitudeSpan: bbox[4] - bbox[1],
      verticalSpan: bbox[5] - bbox[2],
      crossesAntimeridian,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bbox: [170, -10, 0, -170, 20, 100] },
  output: {
    longitudeSpan: 20,
    latitudeSpan: 30,
    verticalSpan: 100,
    crossesAntimeridian: true,
  },
} satisfies ToolExample<Input, Output>;
export const bboxSixValueAxisBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geojson/bbox-six-value-axis-budget",
    title: "Bbox Six Value Axis Budget Tool",
    description:
      "Axis spans of a six-value longitude/latitude/height bounding box, allowing an antimeridian crossing.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bbox: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["bbox"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        longitudeSpan: { type: "number" },
        latitudeSpan: { type: "number" },
        verticalSpan: { type: "number" },
        crossesAntimeridian: { type: "boolean" },
      },
      required: [
        "longitudeSpan",
        "latitudeSpan",
        "verticalSpan",
        "crossesAntimeridian",
      ],
    },
    ports: {
      inputs: [
        {
          id: "bbox",
          label: "Bbox",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "longitudeSpan",
          label: "Longitude Span",
          valueType: { type: "number" },
        },
        {
          id: "latitudeSpan",
          label: "Latitude Span",
          valueType: { type: "number" },
        },
        {
          id: "verticalSpan",
          label: "Vertical Span",
          valueType: { type: "number" },
        },
        {
          id: "crossesAntimeridian",
          label: "Crosses Antimeridian",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = bboxSixValueAxisBudgetTool.execute;
export default bboxSixValueAxisBudgetTool;
