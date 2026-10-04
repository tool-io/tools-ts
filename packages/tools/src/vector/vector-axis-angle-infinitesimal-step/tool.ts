import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly vector: readonly number[];
  readonly axis: readonly number[];
  readonly angle: number;
};
export type Output = { readonly firstOrderVector: readonly number[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    vector: { type: "array", maxItems: 256, items: { type: "number" } },
    axis: { type: "array", maxItems: 256, items: { type: "number" } },
    angle: { type: "number" },
  },
  required: ["vector", "axis", "angle"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstOrderVector: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
  },
  required: ["firstOrderVector"],
} as const;
/** Return the first-order active Rodrigues rotation v+angle*(unitAxis cross v), with angle in radians. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { vector, axis, angle } = request;
  const compute = (): Output => {
    H.domain(vector.length === 3 && axis.length === 3);
    const n = Math.hypot(...axis);
    H.positive(n);
    const [x, y, z] = axis.map((x) => x / n),
      [a, b, c] = vector;
    return {
      firstOrderVector: [
        a + angle * (y * c - z * b),
        b + angle * (z * a - x * c),
        c + angle * (x * b - y * a),
      ],
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { vector: [1, 0, 0], axis: [0, 0, 1], angle: 0.1 },
  output: { firstOrderVector: [1, 0.1, 0] },
} satisfies ToolExample<Input, Output>;
export const vectorAxisAngleInfinitesimalStepTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "vector/vector-axis-angle-infinitesimal-step",
    title: "Vector Axis Angle Infinitesimal Step Tool",
    description:
      "Return the first-order active Rodrigues rotation v+angle*(unitAxis cross v), with angle in radians.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        vector: { type: "array", maxItems: 256, items: { type: "number" } },
        axis: { type: "array", maxItems: 256, items: { type: "number" } },
        angle: { type: "number" },
      },
      required: ["vector", "axis", "angle"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstOrderVector: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["firstOrderVector"],
    },
    ports: {
      inputs: [
        {
          id: "vector",
          label: "Vector",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "axis",
          label: "Axis",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "angle",
          label: "Angle",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "firstOrderVector",
          label: "First Order Vector",
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
    },
  },
  calculate,
});
export const run = vectorAxisAngleInfinitesimalStepTool.execute;
export default vectorAxisAngleInfinitesimalStepTool;
