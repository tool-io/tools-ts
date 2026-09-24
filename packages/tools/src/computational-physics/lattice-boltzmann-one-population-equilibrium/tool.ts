import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly density: number;
  readonly weight: number;
  readonly cDotU: number;
  readonly speedSquared: number;
  readonly soundSpeedSquared: number;
};
export type Output = { readonly equilibrium: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    density: { type: "number", minimum: 0 },
    weight: { type: "number", minimum: 0 },
    cDotU: { type: "number" },
    speedSquared: { type: "number", minimum: 0 },
    soundSpeedSquared: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["density", "weight", "cDotU", "speedSquared", "soundSpeedSquared"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { equilibrium: { type: "number" } },
  required: ["equilibrium"],
} as const;
/** Second-order isothermal low-Mach equilibrium for one explicitly weighted discrete velocity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { density, weight, cDotU, speedSquared, soundSpeedSquared } = request;
  const compute = (): Output => {
    H.domain(density >= 0 && weight >= 0 && speedSquared >= 0);
    H.positive(soundSpeedSquared);
    return {
      equilibrium:
        weight *
        density *
        (1 +
          cDotU / soundSpeedSquared +
          cDotU ** 2 / (2 * soundSpeedSquared ** 2) -
          speedSquared / (2 * soundSpeedSquared)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    density: 1,
    weight: 0.5,
    cDotU: 0,
    speedSquared: 0,
    soundSpeedSquared: 1,
  },
  output: { equilibrium: 0.5 },
} satisfies ToolExample<Input, Output>;
export const latticeBoltzmannOnePopulationEquilibriumTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "computational-physics/lattice-boltzmann-one-population-equilibrium",
      title: "Lattice Boltzmann One Population Equilibrium Tool",
      description:
        "Second-order isothermal low-Mach equilibrium for one explicitly weighted discrete velocity.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          density: { type: "number", minimum: 0 },
          weight: { type: "number", minimum: 0 },
          cDotU: { type: "number" },
          speedSquared: { type: "number", minimum: 0 },
          soundSpeedSquared: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "density",
          "weight",
          "cDotU",
          "speedSquared",
          "soundSpeedSquared",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { equilibrium: { type: "number" } },
        required: ["equilibrium"],
      },
      ports: {
        inputs: [
          {
            id: "density",
            label: "Density",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "weight",
            label: "Weight",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "cDotU",
            label: "C Dot U",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "speedSquared",
            label: "Speed Squared",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "soundSpeedSquared",
            label: "Sound Speed Squared",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "equilibrium",
            label: "Equilibrium",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = latticeBoltzmannOnePopulationEquilibriumTool.execute;
export default latticeBoltzmannOnePopulationEquilibriumTool;
