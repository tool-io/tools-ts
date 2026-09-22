import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly tangentialSpeed: number;
  readonly gap: number;
  readonly dynamicViscosity: number;
};
export type Output = {
  readonly shearRate: number;
  readonly shearStress: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tangentialSpeed: { type: "number" },
    gap: { type: "number", exclusiveMinimum: 0 },
    dynamicViscosity: { type: "number", minimum: 0 },
  },
  required: ["tangentialSpeed", "gap", "dynamicViscosity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shearRate: { type: "number" },
    shearStress: { type: "number" },
  },
  required: ["shearRate", "shearStress"],
} as const;
/** Linear planar Couette velocity-gradient approximation for a Newtonian fluid, not a vessel-wide shear estimate. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { tangentialSpeed, gap, dynamicViscosity } = request;
  const compute = (): Output => {
    H.positive(gap);
    H.domain(dynamicViscosity >= 0);
    return {
      shearRate: tangentialSpeed / gap,
      shearStress: (dynamicViscosity * tangentialSpeed) / gap,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { tangentialSpeed: 2, gap: 0.1, dynamicViscosity: 0.5 },
  output: { shearRate: 20, shearStress: 10 },
} satisfies ToolExample<Input, Output>;
export const bioreactorShearRateGapFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioengineering/bioreactor-shear-rate-gap-factor",
    title: "Bioreactor Shear Rate Gap Factor Tool",
    description:
      "Linear planar Couette velocity-gradient approximation for a Newtonian fluid, not a vessel-wide shear estimate.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tangentialSpeed: { type: "number" },
        gap: { type: "number", exclusiveMinimum: 0 },
        dynamicViscosity: { type: "number", minimum: 0 },
      },
      required: ["tangentialSpeed", "gap", "dynamicViscosity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        shearRate: { type: "number" },
        shearStress: { type: "number" },
      },
      required: ["shearRate", "shearStress"],
    },
    ports: {
      inputs: [
        {
          id: "tangentialSpeed",
          label: "Tangential Speed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "gap",
          label: "Gap",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dynamicViscosity",
          label: "Dynamic Viscosity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "shearRate", label: "Shear Rate", valueType: { type: "number" } },
        {
          id: "shearStress",
          label: "Shear Stress",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = bioreactorShearRateGapFactorTool.execute;
export default bioreactorShearRateGapFactorTool;
