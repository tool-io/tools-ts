import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pressure: number;
  readonly density: number;
  readonly gravity: number;
};
export type Output = { readonly head: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pressure: { type: "number" },
    density: { type: "number", exclusiveMinimum: 0 },
    gravity: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["pressure", "density", "gravity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { head: { type: "number" } },
  required: ["head"],
} as const;
/** Convert signed pascal gauge pressure into metres of head for an explicit density and gravitational acceleration. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { pressure, density, gravity } = input;
  const compute = (): Output => {
    H.positive(density);
    H.positive(gravity);
    return { head: pressure / (density * gravity) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { pressure: 9800, density: 1000, gravity: 9.8 },
  output: { head: 1 },
} satisfies ToolExample<Input, Output>;
export const pressureHeadFluidDensityReferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "convert/pressure-head-fluid-density-reference",
    title: "Pressure Head Fluid Density Reference Tool",
    description:
      "Convert signed pascal gauge pressure into metres of head for an explicit density and gravitational acceleration.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pressure: { type: "number" },
        density: { type: "number", exclusiveMinimum: 0 },
        gravity: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["pressure", "density", "gravity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { head: { type: "number" } },
      required: ["head"],
    },
    ports: {
      inputs: [
        {
          id: "pressure",
          label: "Pressure",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "density",
          label: "Density",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "gravity",
          label: "Gravity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "head", label: "Head", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = pressureHeadFluidDensityReferenceTool.execute;
export default pressureHeadFluidDensityReferenceTool;
