import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly center: number;
  readonly strokeWidth: number;
  readonly deviceScale: number;
};
export type Output = {
  readonly deviceWidth: number;
  readonly snappedCenter: number;
  readonly offset: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    center: { type: "number" },
    strokeWidth: { type: "number", minimum: 0 },
    deviceScale: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["center", "strokeWidth", "deviceScale"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    deviceWidth: { type: "number" },
    snappedCenter: { type: "number" },
    offset: { type: "number" },
  },
  required: ["deviceWidth", "snappedCenter", "offset"],
} as const;
/** Snap the leading stroke edge to a nearest device-pixel boundary; ties follow JavaScript positive-infinity rounding. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { center, strokeWidth, deviceScale } = request;
  const compute = (): Output => {
    H.domain(strokeWidth >= 0);
    H.positive(deviceScale);
    return {
      deviceWidth: strokeWidth * deviceScale,
      snappedCenter:
        (Math.round(center * deviceScale - (strokeWidth * deviceScale) / 2) +
          (strokeWidth * deviceScale) / 2) /
        deviceScale,
      offset:
        (Math.round(center * deviceScale - (strokeWidth * deviceScale) / 2) +
          (strokeWidth * deviceScale) / 2) /
          deviceScale -
        center,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { center: 10, strokeWidth: 1, deviceScale: 1 },
  output: { deviceWidth: 1, snappedCenter: 10.5, offset: 0.5 },
} satisfies ToolExample<Input, Output>;
export const pixelGridHalfStrokeSnapOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graphic-design/pixel-grid-half-stroke-snap-offset",
    title: "Pixel Grid Half Stroke Snap Offset Tool",
    description:
      "Snap the leading stroke edge to a nearest device-pixel boundary; ties follow JavaScript positive-infinity rounding.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        center: { type: "number" },
        strokeWidth: { type: "number", minimum: 0 },
        deviceScale: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["center", "strokeWidth", "deviceScale"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        deviceWidth: { type: "number" },
        snappedCenter: { type: "number" },
        offset: { type: "number" },
      },
      required: ["deviceWidth", "snappedCenter", "offset"],
    },
    ports: {
      inputs: [
        {
          id: "center",
          label: "Center",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "strokeWidth",
          label: "Stroke Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "deviceScale",
          label: "Device Scale",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "deviceWidth",
          label: "Device Width",
          valueType: { type: "number" },
        },
        {
          id: "snappedCenter",
          label: "Snapped Center",
          valueType: { type: "number" },
        },
        { id: "offset", label: "Offset", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = pixelGridHalfStrokeSnapOffsetTool.execute;
export default pixelGridHalfStrokeSnapOffsetTool;
