import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly torque: number;
  readonly radius: number;
  readonly momentArms: number;
};
export type Output = {
  readonly tangentialForce: number;
  readonly forcePerArm: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    torque: { type: "number" },
    radius: { type: "number", exclusiveMinimum: 0 },
    momentArms: { type: "integer", minimum: 1 },
  },
  required: ["torque", "radius", "momentArms"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tangentialForce: { type: "number" },
    forcePerArm: { type: "number" },
  },
  required: ["tangentialForce", "forcePerArm"],
} as const;
/** Calculate endodontic file bench torque radius factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { torque, radius, momentArms } = request;
  const compute = (): Output => {
    H.positive(radius);
    H.integer(momentArms, 1);
    return {
      tangentialForce: torque / radius,
      forcePerArm: torque / (radius * momentArms),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { torque: 0.2, radius: 0.01, momentArms: 2 },
  output: { tangentialForce: 20, forcePerArm: 10 },
} satisfies ToolExample<Input, Output>;
export const endodonticFileBenchTorqueRadiusFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "endodontics/endodontic-file-bench-torque-radius-factor",
      title: "Endodontic File Bench Torque Radius Factor Tool",
      description:
        "Calculate endodontic file bench torque radius factor from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          torque: { type: "number" },
          radius: { type: "number", exclusiveMinimum: 0 },
          momentArms: { type: "integer", minimum: 1 },
        },
        required: ["torque", "radius", "momentArms"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          tangentialForce: { type: "number" },
          forcePerArm: { type: "number" },
        },
        required: ["tangentialForce", "forcePerArm"],
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
          {
            id: "momentArms",
            label: "Moment Arms",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "tangentialForce",
            label: "Tangential Force",
            valueType: { type: "number" },
          },
          {
            id: "forcePerArm",
            label: "Force Per Arm",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = endodonticFileBenchTorqueRadiusFactorTool.execute;
export default endodonticFileBenchTorqueRadiusFactorTool;
