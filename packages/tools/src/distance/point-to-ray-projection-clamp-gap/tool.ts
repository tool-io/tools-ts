import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly point: readonly number[];
  readonly origin: readonly number[];
  readonly direction: readonly number[];
};
export type Output = {
  readonly parameter: number;
  readonly distance: number;
  readonly behindOrigin: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    point: { type: "array", maxItems: 256, items: { type: "number" } },
    origin: { type: "array", maxItems: 256, items: { type: "number" } },
    direction: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["point", "origin", "direction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parameter: { type: "number" },
    distance: { type: "number" },
    behindOrigin: { type: "boolean" },
  },
  required: ["parameter", "distance", "behindOrigin"],
} as const;
/** Calculate point to ray projection clamp gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { point, origin, direction } = request;
  const compute = (): Output => {
    H.sameLength(point, origin);
    H.sameLength(point, direction);
    H.domain(point.length > 0);
    const norm = H.dot(direction, direction);
    H.positive(norm);
    const v = point.map((x, i) => x - origin[i]),
      raw = H.dot(v, direction) / norm,
      parameter = Math.max(0, raw);
    return {
      parameter,
      distance: Math.hypot(...v.map((x, i) => x - parameter * direction[i])),
      behindOrigin: raw < 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { point: [3, 4], origin: [0, 0], direction: [1, 0] },
  output: { parameter: 3, distance: 4, behindOrigin: false },
} satisfies ToolExample<Input, Output>;
export const pointToRayProjectionClampGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "distance/point-to-ray-projection-clamp-gap",
    title: "Point To Ray Projection Clamp Gap Tool",
    description:
      "Calculate point to ray projection clamp gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        point: { type: "array", maxItems: 256, items: { type: "number" } },
        origin: { type: "array", maxItems: 256, items: { type: "number" } },
        direction: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["point", "origin", "direction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        parameter: { type: "number" },
        distance: { type: "number" },
        behindOrigin: { type: "boolean" },
      },
      required: ["parameter", "distance", "behindOrigin"],
    },
    ports: {
      inputs: [
        {
          id: "point",
          label: "Point",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "origin",
          label: "Origin",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "direction",
          label: "Direction",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        { id: "parameter", label: "Parameter", valueType: { type: "number" } },
        { id: "distance", label: "Distance", valueType: { type: "number" } },
        {
          id: "behindOrigin",
          label: "Behind Origin",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = pointToRayProjectionClampGapTool.execute;
export default pointToRayProjectionClampGapTool;
