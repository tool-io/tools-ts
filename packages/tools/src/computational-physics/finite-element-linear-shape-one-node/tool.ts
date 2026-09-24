import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coordinate: number;
  readonly left: number;
  readonly right: number;
  readonly node: string;
};
export type Output = { readonly shape: number; readonly derivative: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coordinate: { type: "number" },
    left: { type: "number" },
    right: { type: "number" },
    node: { type: "string", maxLength: 8192, enum: ["left", "right"] },
  },
  required: ["coordinate", "left", "right", "node"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { shape: { type: "number" }, derivative: { type: "number" } },
  required: ["shape", "derivative"],
} as const;
/** Calculate finite element linear shape one node from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coordinate, left, right, node } = request;
  const compute = (): Output => {
    H.domain(right > left && coordinate >= left && coordinate <= right);
    H.domain(["left", "right"].includes(node));
    return {
      shape:
        node === "left"
          ? (right - coordinate) / (right - left)
          : (coordinate - left) / (right - left),
      derivative: node === "left" ? -1 / (right - left) : 1 / (right - left),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { coordinate: 1, left: 0, right: 4, node: "left" },
  output: { shape: 0.75, derivative: -0.25 },
} satisfies ToolExample<Input, Output>;
export const finiteElementLinearShapeOneNodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-physics/finite-element-linear-shape-one-node",
    title: "Finite Element Linear Shape One Node Tool",
    description:
      "Calculate finite element linear shape one node from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coordinate: { type: "number" },
        left: { type: "number" },
        right: { type: "number" },
        node: { type: "string", maxLength: 8192, enum: ["left", "right"] },
      },
      required: ["coordinate", "left", "right", "node"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { shape: { type: "number" }, derivative: { type: "number" } },
      required: ["shape", "derivative"],
    },
    ports: {
      inputs: [
        {
          id: "coordinate",
          label: "Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "left",
          label: "Left",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "right",
          label: "Right",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "node",
          label: "Node",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "shape", label: "Shape", valueType: { type: "number" } },
        {
          id: "derivative",
          label: "Derivative",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = finiteElementLinearShapeOneNodeTool.execute;
export default finiteElementLinearShapeOneNodeTool;
