import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly mass: number;
  readonly momentum: number;
  readonly energy: number;
};
export type Output = {
  readonly expectedEnergy: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mass: { type: "number", exclusiveMinimum: 0 },
    momentum: { type: "number" },
    energy: { type: "number", minimum: 0 },
  },
  required: ["mass", "momentum", "energy"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expectedEnergy: { type: "number" },
    residual: { type: "number" },
  },
  required: ["expectedEnergy", "residual"],
} as const;
/** Compare supplied translational kinetic energy with the classical momentum relation p²/(2m). */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { mass, momentum, energy } = input;
  const compute = (): Output => {
    H.positive(mass);
    H.domain(energy >= 0);
    const expectedEnergy = (momentum * momentum) / (2 * mass);
    return { expectedEnergy, residual: energy - expectedEnergy };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { mass: 2, momentum: 4, energy: 4 },
  output: { expectedEnergy: 4, residual: 0 },
} satisfies ToolExample<Input, Output>;
export const momentumEnergyClassicalConsistencyResidualTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "physics/momentum-energy-classical-consistency-residual",
      title: "Momentum Energy Classical Consistency Residual Tool",
      description:
        "Compare supplied translational kinetic energy with the classical momentum relation p²/(2m).",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          mass: { type: "number", exclusiveMinimum: 0 },
          momentum: { type: "number" },
          energy: { type: "number", minimum: 0 },
        },
        required: ["mass", "momentum", "energy"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          expectedEnergy: { type: "number" },
          residual: { type: "number" },
        },
        required: ["expectedEnergy", "residual"],
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
            id: "momentum",
            label: "Momentum",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "energy",
            label: "Energy",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "expectedEnergy",
            label: "Expected Energy",
            valueType: { type: "number" },
          },
          { id: "residual", label: "Residual", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = momentumEnergyClassicalConsistencyResidualTool.execute;
export default momentumEnergyClassicalConsistencyResidualTool;
