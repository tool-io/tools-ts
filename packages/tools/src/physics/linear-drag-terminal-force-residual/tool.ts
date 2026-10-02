import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly drivingForce: number;
  readonly dragCoefficient: number;
  readonly velocity: number;
};
export type Output = {
  readonly terminalVelocity: number;
  readonly residualForce: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    drivingForce: { type: "number" },
    dragCoefficient: { type: "number", exclusiveMinimum: 0 },
    velocity: { type: "number" },
  },
  required: ["drivingForce", "dragCoefficient", "velocity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    terminalVelocity: { type: "number" },
    residualForce: { type: "number" },
  },
  required: ["terminalVelocity", "residualForce"],
} as const;
/** Compare a supplied velocity against the terminal balance of a constant force and linear signed drag. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { drivingForce, dragCoefficient, velocity } = input;
  const compute = (): Output => {
    H.positive(dragCoefficient);
    return {
      terminalVelocity: drivingForce / dragCoefficient,
      residualForce: drivingForce - dragCoefficient * velocity,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { drivingForce: 10, dragCoefficient: 2, velocity: 3 },
  output: { terminalVelocity: 5, residualForce: 4 },
} satisfies ToolExample<Input, Output>;
export const linearDragTerminalForceResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physics/linear-drag-terminal-force-residual",
    title: "Linear Drag Terminal Force Residual Tool",
    description:
      "Compare a supplied velocity against the terminal balance of a constant force and linear signed drag.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        drivingForce: { type: "number" },
        dragCoefficient: { type: "number", exclusiveMinimum: 0 },
        velocity: { type: "number" },
      },
      required: ["drivingForce", "dragCoefficient", "velocity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        terminalVelocity: { type: "number" },
        residualForce: { type: "number" },
      },
      required: ["terminalVelocity", "residualForce"],
    },
    ports: {
      inputs: [
        {
          id: "drivingForce",
          label: "Driving Force",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dragCoefficient",
          label: "Drag Coefficient",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "velocity",
          label: "Velocity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "terminalVelocity",
          label: "Terminal Velocity",
          valueType: { type: "number" },
        },
        {
          id: "residualForce",
          label: "Residual Force",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = linearDragTerminalForceResidualTool.execute;
export default linearDragTerminalForceResidualTool;
