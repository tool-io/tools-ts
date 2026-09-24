import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly arealMass: number; readonly density: number };
export type Output = { readonly thickness: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    arealMass: { type: "number", minimum: 0 },
    density: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["arealMass", "density"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { thickness: { type: "number" } },
  required: ["thickness"],
} as const;
/** Calculate areal mass equivalent solid thickness from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { arealMass, density } = request;
  const compute = (): Output => {
    H.domain(arealMass >= 0);
    H.positive(density);
    return { thickness: arealMass / density };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { arealMass: 2, density: 8000 },
  output: { thickness: 0.00025 },
} satisfies ToolExample<Input, Output>;
export const arealMassEquivalentSolidThicknessTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "convert/areal-mass-equivalent-solid-thickness",
    title: "Areal Mass Equivalent Solid Thickness Tool",
    description:
      "Calculate areal mass equivalent solid thickness from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        arealMass: { type: "number", minimum: 0 },
        density: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["arealMass", "density"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { thickness: { type: "number" } },
      required: ["thickness"],
    },
    ports: {
      inputs: [
        {
          id: "arealMass",
          label: "Areal Mass",
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
        { id: "thickness", label: "Thickness", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = arealMassEquivalentSolidThicknessTool.execute;
export default arealMassEquivalentSolidThicknessTool;
