import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly velocity: number;
  readonly temperatureGradient: number;
};
export type Output = { readonly tendency: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    velocity: { type: "number" },
    temperatureGradient: { type: "number" },
  },
  required: ["velocity", "temperatureGradient"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tendency: { type: "number" } },
  required: ["tendency"],
} as const;
/** Calculate thermal advection one horizontal component from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { velocity, temperatureGradient } = request;
  const compute = (): Output => {
    return { tendency: -velocity * temperatureGradient };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { velocity: 10, temperatureGradient: 0.001 },
  output: { tendency: -0.01 },
} satisfies ToolExample<Input, Output>;
export const thermalAdvectionOneHorizontalComponentTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "atmospheric-science/thermal-advection-one-horizontal-component",
      title: "Thermal Advection One Horizontal Component Tool",
      description:
        "Calculate thermal advection one horizontal component from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          velocity: { type: "number" },
          temperatureGradient: { type: "number" },
        },
        required: ["velocity", "temperatureGradient"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { tendency: { type: "number" } },
        required: ["tendency"],
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
            id: "temperatureGradient",
            label: "Temperature Gradient",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "tendency", label: "Tendency", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = thermalAdvectionOneHorizontalComponentTool.execute;
export default thermalAdvectionOneHorizontalComponentTool;
