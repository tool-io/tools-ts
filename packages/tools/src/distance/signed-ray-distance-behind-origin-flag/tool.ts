import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly point: readonly number[];
  readonly origin: readonly number[];
  readonly direction: readonly number[];
};
export type Output = {
  readonly parameter: number;
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
    behindOrigin: { type: "boolean" },
  },
  required: ["parameter", "behindOrigin"],
} as const;
/** Signed orthogonal projection parameter along a supplied nonzero ray direction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { point, origin, direction } = request;
  const compute = (): Output => {
    H.sameLength(point, origin);
    H.sameLength(point, direction);
    H.domain(point.length > 0 && direction.some((x) => x !== 0));
    return {
      parameter:
        H.dot(
          point.map((x, i) => x - origin[i]),
          direction,
        ) / H.dot(direction, direction),
      behindOrigin:
        H.dot(
          point.map((x, i) => x - origin[i]),
          direction,
        ) < 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { point: [2, 0], origin: [0, 0], direction: [1, 0] },
  output: { parameter: 2, behindOrigin: false },
} satisfies ToolExample<Input, Output>;
export const signedRayDistanceBehindOriginFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "distance/signed-ray-distance-behind-origin-flag",
    title: "Signed Ray Distance Behind Origin Flag Tool",
    description:
      "Signed orthogonal projection parameter along a supplied nonzero ray direction.",
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
        behindOrigin: { type: "boolean" },
      },
      required: ["parameter", "behindOrigin"],
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
export const run = signedRayDistanceBehindOriginFlagTool.execute;
export default signedRayDistanceBehindOriginFlagTool;
