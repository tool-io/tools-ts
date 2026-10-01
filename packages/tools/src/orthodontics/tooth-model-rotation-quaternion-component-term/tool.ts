import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly axis: readonly number[];
  readonly angleRadians: number;
};
export type Output = {
  readonly w: number;
  readonly x: number;
  readonly y: number;
  readonly z: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    axis: { type: "array", maxItems: 256, items: { type: "number" } },
    angleRadians: { type: "number" },
  },
  required: ["axis", "angleRadians"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    w: { type: "number" },
    x: { type: "number" },
    y: { type: "number" },
    z: { type: "number" },
  },
  required: ["w", "x", "y", "z"],
} as const;
/** Construct a right-handed axis-angle quaternion for an explicit model rotation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { axis, angleRadians } = request;
  const compute = (): Output => {
    H.domain(axis.length === 3 && Math.hypot(...axis) > 0, "axis");
    const norm = Math.hypot(...axis),
      s = Math.sin(angleRadians / 2);
    return {
      w: Math.cos(angleRadians / 2),
      x: (axis[0] / norm) * s,
      y: (axis[1] / norm) * s,
      z: (axis[2] / norm) * s,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { axis: [0, 0, 2], angleRadians: 3.141592653589793 },
  output: { w: 6.123233995736766e-17, x: 0, y: 0, z: 1 },
} satisfies ToolExample<Input, Output>;
export const toothModelRotationQuaternionComponentTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "orthodontics/tooth-model-rotation-quaternion-component-term",
      title: "Tooth Model Rotation Quaternion Component Term Tool",
      description:
        "Construct a right-handed axis-angle quaternion for an explicit model rotation.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          axis: { type: "array", maxItems: 256, items: { type: "number" } },
          angleRadians: { type: "number" },
        },
        required: ["axis", "angleRadians"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          w: { type: "number" },
          x: { type: "number" },
          y: { type: "number" },
          z: { type: "number" },
        },
        required: ["w", "x", "y", "z"],
      },
      ports: {
        inputs: [
          {
            id: "axis",
            label: "Axis",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "angleRadians",
            label: "Angle Radians",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "w", label: "W", valueType: { type: "number" } },
          { id: "x", label: "X", valueType: { type: "number" } },
          { id: "y", label: "Y", valueType: { type: "number" } },
          { id: "z", label: "Z", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = toothModelRotationQuaternionComponentTermTool.execute;
export default toothModelRotationQuaternionComponentTermTool;
