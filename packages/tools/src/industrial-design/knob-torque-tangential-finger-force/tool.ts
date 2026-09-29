import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly torque: number; readonly radius: number };
export type Output = { readonly force: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    torque: { type: "number" },
    radius: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["torque", "radius"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { force: { type: "number" } },
  required: ["force"],
} as const;
/** Calculate knob torque tangential finger force from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { torque, radius } = request;
  const compute = (): Output => {
    H.positive(radius);
    return { force: torque / radius };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { torque: 0.6, radius: 0.03 },
  output: { force: 20 },
} satisfies ToolExample<Input, Output>;
export const knobTorqueTangentialFingerForceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-design/knob-torque-tangential-finger-force",
    title: "Knob Torque Tangential Finger Force Tool",
    description:
      "Calculate knob torque tangential finger force from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        torque: { type: "number" },
        radius: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["torque", "radius"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { force: { type: "number" } },
      required: ["force"],
    },
    ports: {
      inputs: [
        {
          id: "torque",
          label: "Torque",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "radius",
          label: "Radius",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "force", label: "Force", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = knobTorqueTangentialFingerForceTool.execute;
export default knobTorqueTangentialFingerForceTool;
