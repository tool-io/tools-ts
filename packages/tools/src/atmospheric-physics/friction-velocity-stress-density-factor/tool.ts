import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stressMagnitude: number;
  readonly density: number;
};
export type Output = { readonly frictionVelocity: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stressMagnitude: { type: "number", minimum: 0 },
    density: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["stressMagnitude", "density"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { frictionVelocity: { type: "number" } },
  required: ["frictionVelocity"],
} as const;
/** Calculate friction velocity stress density factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stressMagnitude, density } = request;
  const compute = (): Output => {
    H.domain(stressMagnitude >= 0);
    H.positive(density);
    return { frictionVelocity: Math.sqrt(stressMagnitude / density) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { stressMagnitude: 4, density: 1 },
  output: { frictionVelocity: 2 },
} satisfies ToolExample<Input, Output>;
export const frictionVelocityStressDensityFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "atmospheric-physics/friction-velocity-stress-density-factor",
      title: "Friction Velocity Stress Density Factor Tool",
      description:
        "Calculate friction velocity stress density factor from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          stressMagnitude: { type: "number", minimum: 0 },
          density: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["stressMagnitude", "density"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { frictionVelocity: { type: "number" } },
        required: ["frictionVelocity"],
      },
      ports: {
        inputs: [
          {
            id: "stressMagnitude",
            label: "Stress Magnitude",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "density",
            label: "Density",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "frictionVelocity",
            label: "Friction Velocity",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = frictionVelocityStressDensityFactorTool.execute;
export default frictionVelocityStressDensityFactorTool;
