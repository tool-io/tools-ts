import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly mass: number;
  readonly objectDensity: number;
  readonly fluidDensity: number;
};
export type Output = {
  readonly apparentMass: number;
  readonly displacedMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mass: { type: "number", minimum: 0 },
    objectDensity: { type: "number", exclusiveMinimum: 0 },
    fluidDensity: { type: "number", minimum: 0 },
  },
  required: ["mass", "objectDensity", "fluidDensity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    apparentMass: { type: "number" },
    displacedMass: { type: "number" },
  },
  required: ["apparentMass", "displacedMass"],
} as const;
/** Calculate buoyancy apparent mass density factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { mass, objectDensity, fluidDensity } = request;
  const compute = (): Output => {
    H.domain(mass >= 0 && fluidDensity >= 0);
    H.positive(objectDensity);
    const displacedMass = (mass * fluidDensity) / objectDensity;
    return { apparentMass: mass - displacedMass, displacedMass };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { mass: 8, objectDensity: 2000, fluidDensity: 1000 },
  output: { apparentMass: 4, displacedMass: 4 },
} satisfies ToolExample<Input, Output>;
export const buoyancyApparentMassDensityFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physics/buoyancy-apparent-mass-density-factor",
    title: "Buoyancy Apparent Mass Density Factor Tool",
    description:
      "Calculate buoyancy apparent mass density factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        mass: { type: "number", minimum: 0 },
        objectDensity: { type: "number", exclusiveMinimum: 0 },
        fluidDensity: { type: "number", minimum: 0 },
      },
      required: ["mass", "objectDensity", "fluidDensity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        apparentMass: { type: "number" },
        displacedMass: { type: "number" },
      },
      required: ["apparentMass", "displacedMass"],
    },
    ports: {
      inputs: [
        {
          id: "mass",
          label: "Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "objectDensity",
          label: "Object Density",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fluidDensity",
          label: "Fluid Density",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "apparentMass",
          label: "Apparent Mass",
          valueType: { type: "number" },
        },
        {
          id: "displacedMass",
          label: "Displaced Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = buoyancyApparentMassDensityFactorTool.execute;
export default buoyancyApparentMassDensityFactorTool;
