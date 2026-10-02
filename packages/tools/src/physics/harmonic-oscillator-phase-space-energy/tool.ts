import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly mass: number;
  readonly angularFrequency: number;
  readonly position: number;
  readonly velocity: number;
};
export type Output = {
  readonly kinetic: number;
  readonly potential: number;
  readonly energy: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mass: { type: "number", exclusiveMinimum: 0 },
    angularFrequency: { type: "number", minimum: 0 },
    position: { type: "number" },
    velocity: { type: "number" },
  },
  required: ["mass", "angularFrequency", "position", "velocity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    kinetic: { type: "number" },
    potential: { type: "number" },
    energy: { type: "number" },
  },
  required: ["kinetic", "potential", "energy"],
} as const;
/** Calculate harmonic oscillator phase space energy from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { mass, angularFrequency, position, velocity } = request;
  const compute = (): Output => {
    H.positive(mass);
    H.domain(angularFrequency >= 0);
    const kinetic = (mass * velocity * velocity) / 2,
      potential = (mass * (angularFrequency * position) ** 2) / 2;
    return { kinetic, potential, energy: kinetic + potential };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { mass: 2, angularFrequency: 3, position: 2, velocity: 4 },
  output: { kinetic: 16, potential: 36, energy: 52 },
} satisfies ToolExample<Input, Output>;
export const harmonicOscillatorPhaseSpaceEnergyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physics/harmonic-oscillator-phase-space-energy",
    title: "Harmonic Oscillator Phase Space Energy Tool",
    description:
      "Calculate harmonic oscillator phase space energy from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        mass: { type: "number", exclusiveMinimum: 0 },
        angularFrequency: { type: "number", minimum: 0 },
        position: { type: "number" },
        velocity: { type: "number" },
      },
      required: ["mass", "angularFrequency", "position", "velocity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        kinetic: { type: "number" },
        potential: { type: "number" },
        energy: { type: "number" },
      },
      required: ["kinetic", "potential", "energy"],
    },
    ports: {
      inputs: [
        {
          id: "mass",
          label: "Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "angularFrequency",
          label: "Angular Frequency",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "position",
          label: "Position",
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
        { id: "kinetic", label: "Kinetic", valueType: { type: "number" } },
        { id: "potential", label: "Potential", valueType: { type: "number" } },
        { id: "energy", label: "Energy", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = harmonicOscillatorPhaseSpaceEnergyTool.execute;
export default harmonicOscillatorPhaseSpaceEnergyTool;
