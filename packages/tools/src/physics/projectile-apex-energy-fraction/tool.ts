import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly horizontalSpeed: number;
  readonly verticalSpeed: number;
};
export type Output = {
  readonly retainedKineticFraction: number;
  readonly initialSpeedSquared: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    horizontalSpeed: { type: "number" },
    verticalSpeed: { type: "number" },
  },
  required: ["horizontalSpeed", "verticalSpeed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    retainedKineticFraction: { type: "number" },
    initialSpeedSquared: { type: "number" },
  },
  required: ["retainedKineticFraction", "initialSpeedSquared"],
} as const;
/** Ideal no-drag projectile kinetic-energy fraction at the vertical apex, relative to launch, for nonzero launch speed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { horizontalSpeed, verticalSpeed } = request;
  const compute = (): Output => {
    H.domain(horizontalSpeed ** 2 + verticalSpeed ** 2 > 0);
    return {
      retainedKineticFraction:
        horizontalSpeed ** 2 / (horizontalSpeed ** 2 + verticalSpeed ** 2),
      initialSpeedSquared: horizontalSpeed ** 2 + verticalSpeed ** 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { horizontalSpeed: 3, verticalSpeed: 4 },
  output: { retainedKineticFraction: 0.36, initialSpeedSquared: 25 },
} satisfies ToolExample<Input, Output>;
export const projectileApexEnergyFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physics/projectile-apex-energy-fraction",
    title: "Projectile Apex Energy Fraction Tool",
    description:
      "Ideal no-drag projectile kinetic-energy fraction at the vertical apex, relative to launch, for nonzero launch speed.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        horizontalSpeed: { type: "number" },
        verticalSpeed: { type: "number" },
      },
      required: ["horizontalSpeed", "verticalSpeed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        retainedKineticFraction: { type: "number" },
        initialSpeedSquared: { type: "number" },
      },
      required: ["retainedKineticFraction", "initialSpeedSquared"],
    },
    ports: {
      inputs: [
        {
          id: "horizontalSpeed",
          label: "Horizontal Speed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "verticalSpeed",
          label: "Vertical Speed",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "retainedKineticFraction",
          label: "Retained Kinetic Fraction",
          valueType: { type: "number" },
        },
        {
          id: "initialSpeedSquared",
          label: "Initial Speed Squared",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = projectileApexEnergyFractionTool.execute;
export default projectileApexEnergyFractionTool;
