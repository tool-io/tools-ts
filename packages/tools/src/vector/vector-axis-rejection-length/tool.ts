import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly vector: readonly number[];
  readonly axis: readonly number[];
};
export type Output = { readonly perpendicularLength: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    vector: { type: "array", maxItems: 256, items: { type: "number" } },
    axis: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["vector", "axis"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { perpendicularLength: { type: "number" } },
  required: ["perpendicularLength"],
} as const;
/** Return only the perpendicular component magnitude relative to a supplied nonzero axis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { vector, axis } = request;
  const compute = (): Output => {
    H.sameLength(vector, axis);
    H.domain(axis.length > 0);
    const scale = Math.max(...axis.map(Math.abs));
    H.domain(scale > 0, "axis", "Provide a nonzero axis.");
    const scaled = axis.map((x) => x / scale),
      length = Math.hypot(...scaled),
      unit = scaled.map((x) => x / length),
      projection = H.dot(vector, unit);
    return {
      perpendicularLength: Math.hypot(
        ...vector.map((x, i) => x - projection * unit[i]),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { vector: [3, 4], axis: [1, 0] },
  output: { perpendicularLength: 4 },
} satisfies ToolExample<Input, Output>;
export const vectorAxisRejectionLengthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "vector/vector-axis-rejection-length",
    title: "Vector Axis Rejection Length Tool",
    description:
      "Return only the perpendicular component magnitude relative to a supplied nonzero axis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        vector: { type: "array", maxItems: 256, items: { type: "number" } },
        axis: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["vector", "axis"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { perpendicularLength: { type: "number" } },
      required: ["perpendicularLength"],
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
      ],
      outputs: [
        {
          id: "perpendicularLength",
          label: "Perpendicular Length",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = vectorAxisRejectionLengthTool.execute;
export default vectorAxisRejectionLengthTool;
