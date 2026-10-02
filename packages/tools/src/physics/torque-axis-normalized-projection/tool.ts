import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly torque: readonly number[];
  readonly axis: readonly number[];
};
export type Output = { readonly axialTorque: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    torque: { type: "array", maxItems: 256, items: { type: "number" } },
    axis: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["torque", "axis"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { axialTorque: { type: "number" } },
  required: ["axialTorque"],
} as const;
/** Calculate torque axis normalized projection from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { torque, axis } = request;
  const compute = (): Output => {
    H.domain(torque.length === 3 && axis.length === 3);
    const norm = Math.hypot(...axis);
    H.positive(norm);
    return { axialTorque: H.dot(torque, axis) / norm };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { torque: [2, 3, 4], axis: [0, 0, 2] },
  output: { axialTorque: 4 },
} satisfies ToolExample<Input, Output>;
export const torqueAxisNormalizedProjectionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physics/torque-axis-normalized-projection",
    title: "Torque Axis Normalized Projection Tool",
    description:
      "Calculate torque axis normalized projection from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        torque: { type: "array", maxItems: 256, items: { type: "number" } },
        axis: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["torque", "axis"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { axialTorque: { type: "number" } },
      required: ["axialTorque"],
    },
    ports: {
      inputs: [
        {
          id: "torque",
          label: "Torque",
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
          id: "axialTorque",
          label: "Axial Torque",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = torqueAxisNormalizedProjectionTool.execute;
export default torqueAxisNormalizedProjectionTool;
