import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly shearComponent: number;
  readonly convergence: number;
};
export type Output = { readonly reducedShear: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shearComponent: { type: "number" },
    convergence: { type: "number" },
  },
  required: ["shearComponent", "convergence"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { reducedShear: { type: "number" } },
  required: ["reducedShear"],
} as const;
/** Calculate one signed reduced-shear component gamma/(1-kappa) for explicit convergence other than one. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { shearComponent, convergence } = request;
  const compute = (): Output => {
    H.domain(convergence !== 1, "convergence");
    return { reducedShear: shearComponent / (1 - convergence) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { shearComponent: 0.1, convergence: 0.5 },
  output: { reducedShear: 0.2 },
} satisfies ToolExample<Input, Output>;
export const weakLensingReducedShearScalarTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["cosmology", "physics"],
      keywords: ["cosmology", "physics"],
    },
    id: "cosmology/weak-lensing-reduced-shear-scalar",
    title: "Weak Lensing Reduced Shear Scalar",
    description:
      "Calculate one signed reduced-shear component gamma/(1-kappa) for explicit convergence other than one.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        shearComponent: { type: "number" },
        convergence: { type: "number" },
      },
      required: ["shearComponent", "convergence"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { reducedShear: { type: "number" } },
      required: ["reducedShear"],
    },
    ports: {
      inputs: [
        {
          id: "shearComponent",
          label: "Shear Component",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "convergence",
          label: "Convergence",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "reducedShear",
          label: "Reduced Shear",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = weakLensingReducedShearScalarTool.execute;
export default weakLensingReducedShearScalarTool;
