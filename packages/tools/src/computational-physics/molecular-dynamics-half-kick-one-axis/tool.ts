import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly velocity: number;
  readonly force: number;
  readonly mass: number;
  readonly step: number;
};
export type Output = {
  readonly increment: number;
  readonly nextVelocity: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    velocity: { type: "number" },
    force: { type: "number" },
    mass: { type: "number", exclusiveMinimum: 0 },
    step: { type: "number", minimum: 0 },
  },
  required: ["velocity", "force", "mass", "step"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    increment: { type: "number" },
    nextVelocity: { type: "number" },
  },
  required: ["increment", "nextVelocity"],
} as const;
/** Calculate molecular dynamics half kick one axis from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { velocity, force, mass, step } = request;
  const compute = (): Output => {
    H.positive(mass);
    H.domain(step >= 0);
    return {
      increment: (force * step) / (2 * mass),
      nextVelocity: velocity + (force * step) / (2 * mass),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { velocity: 2, force: 4, mass: 2, step: 0.5 },
  output: { increment: 0.5, nextVelocity: 2.5 },
} satisfies ToolExample<Input, Output>;
export const molecularDynamicsHalfKickOneAxisTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-physics/molecular-dynamics-half-kick-one-axis",
    title: "Molecular Dynamics Half Kick One Axis Tool",
    description:
      "Calculate molecular dynamics half kick one axis from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        velocity: { type: "number" },
        force: { type: "number" },
        mass: { type: "number", exclusiveMinimum: 0 },
        step: { type: "number", minimum: 0 },
      },
      required: ["velocity", "force", "mass", "step"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        increment: { type: "number" },
        nextVelocity: { type: "number" },
      },
      required: ["increment", "nextVelocity"],
    },
    ports: {
      inputs: [
        {
          id: "velocity",
          label: "Velocity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "force",
          label: "Force",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "mass",
          label: "Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "step",
          label: "Step",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "increment", label: "Increment", valueType: { type: "number" } },
        {
          id: "nextVelocity",
          label: "Next Velocity",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = molecularDynamicsHalfKickOneAxisTool.execute;
export default molecularDynamicsHalfKickOneAxisTool;
