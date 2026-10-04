import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly vector: readonly number[];
  readonly axis: readonly number[];
  readonly angle: number;
};
export type Output = {
  readonly axial: readonly number[];
  readonly invariant: boolean;
};
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
    axial: { type: "array", maxItems: 256, items: { type: "number" } },
    invariant: { type: "boolean" },
  },
  required: ["axial", "invariant"],
} as const;
/** Calculate vector rodrigues axial component from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { vector, axis, angle } = input;
  const compute = (): Output => {
    H.sameLength(vector, axis);
    const norm = H.dot(axis, axis);
    H.positive(norm);
    H.finite(angle);
    const scale = H.dot(vector, axis) / norm;
    return { axial: axis.map((x) => x * scale), invariant: true };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { vector: [2, 3, 4], axis: [0, 0, 2], angle: 1 },
  output: { axial: [0, 0, 4], invariant: true },
} satisfies ToolExample<Input, Output>;
export const vectorRodriguesAxialComponentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "vector/vector-rodrigues-axial-component",
    title: "Vector Rodrigues Axial Component Tool",
    description:
      "Calculate vector rodrigues axial component from explicit caller-supplied inputs.",
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
        axial: { type: "array", maxItems: 256, items: { type: "number" } },
        invariant: { type: "boolean" },
      },
      required: ["axial", "invariant"],
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
          id: "axial",
          label: "Axial",
          valueType: { type: "list", items: { type: "number" } },
        },
        { id: "invariant", label: "Invariant", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = vectorRodriguesAxialComponentTool.execute;
export default vectorRodriguesAxialComponentTool;
