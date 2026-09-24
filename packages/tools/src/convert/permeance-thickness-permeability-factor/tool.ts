import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly permeance: number; readonly thickness: number };
export type Output = { readonly permeability: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    permeance: { type: "number", minimum: 0 },
    thickness: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["permeance", "thickness"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { permeability: { type: "number" } },
  required: ["permeability"],
} as const;
/** Calculate permeance thickness permeability factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { permeance, thickness } = request;
  const compute = (): Output => {
    H.domain(permeance >= 0);
    H.positive(thickness);
    return { permeability: permeance * thickness };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { permeance: 4, thickness: 0.25 },
  output: { permeability: 1 },
} satisfies ToolExample<Input, Output>;
export const permeanceThicknessPermeabilityFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "convert/permeance-thickness-permeability-factor",
      title: "Permeance Thickness Permeability Factor Tool",
      description:
        "Calculate permeance thickness permeability factor from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          permeance: { type: "number", minimum: 0 },
          thickness: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["permeance", "thickness"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { permeability: { type: "number" } },
        required: ["permeability"],
      },
      ports: {
        inputs: [
          {
            id: "permeance",
            label: "Permeance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "thickness",
            label: "Thickness",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "permeability",
            label: "Permeability",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = permeanceThicknessPermeabilityFactorTool.execute;
export default permeanceThicknessPermeabilityFactorTool;
