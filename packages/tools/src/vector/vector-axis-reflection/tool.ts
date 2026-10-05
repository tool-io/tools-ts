import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coordinates: readonly number[];
  readonly axis: number;
};
export type Output = { readonly reflected: readonly number[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coordinates: { type: "array", maxItems: 256, items: { type: "number" } },
    axis: { type: "integer", minimum: 0 },
  },
  required: ["coordinates", "axis"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reflected: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["reflected"],
} as const;
/** Reflect a vector across the coordinate hyperplane normal to one indexed axis by negating that coordinate. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coordinates, axis } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(axis) && axis >= 0 && axis <= coordinates.length - 1,
      "axis",
    ),
      axis);
    return { reflected: coordinates.map((v, i) => (i === axis ? -v : v)) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { coordinates: [2, -3, 4], axis: 1 },
  output: { reflected: [2, 3, 4] },
} satisfies ToolExample<Input, Output>;
export const vectorAxisReflectionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "vector/vector-axis-reflection",
    title: "Vector Axis Reflection Tool",
    description:
      "Reflect a vector across the coordinate hyperplane normal to one indexed axis by negating that coordinate.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coordinates: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        axis: { type: "integer", minimum: 0 },
      },
      required: ["coordinates", "axis"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reflected: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["reflected"],
    },
    ports: {
      inputs: [
        {
          id: "coordinates",
          label: "Coordinates",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "axis",
          label: "Axis",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "reflected",
          label: "Reflected",
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
    },
  },
  calculate,
});
export const run = vectorAxisReflectionTool.execute;
export default vectorAxisReflectionTool;
