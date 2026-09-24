import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly kinematic: number; readonly density: number };
export type Output = { readonly dynamic: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    kinematic: { type: "number", minimum: 0 },
    density: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["kinematic", "density"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { dynamic: { type: "number" } },
  required: ["dynamic"],
} as const;
/** Convert square metres per second and kilograms per cubic metre to pascal seconds. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { kinematic, density } = input;
  const compute = (): Output => {
    H.domain(kinematic >= 0);
    H.positive(density);
    return { dynamic: kinematic * density };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { kinematic: 0.000001, density: 1000 },
  output: { dynamic: 0.001 },
} satisfies ToolExample<Input, Output>;
export const kinematicDynamicViscosityDensityFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "convert/kinematic-dynamic-viscosity-density-factor",
      title: "Kinematic Dynamic Viscosity Density Factor Tool",
      description:
        "Convert square metres per second and kilograms per cubic metre to pascal seconds.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          kinematic: { type: "number", minimum: 0 },
          density: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["kinematic", "density"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { dynamic: { type: "number" } },
        required: ["dynamic"],
      },
      ports: {
        inputs: [
          {
            id: "kinematic",
            label: "Kinematic",
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
          { id: "dynamic", label: "Dynamic", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = kinematicDynamicViscosityDensityFactorTool.execute;
export default kinematicDynamicViscosityDensityFactorTool;
