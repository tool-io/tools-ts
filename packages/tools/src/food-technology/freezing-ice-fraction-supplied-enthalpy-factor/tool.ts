import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly releasedEnthalpy: number;
  readonly sensibleEnthalpy: number;
  readonly mass: number;
  readonly suppliedLatentHeat: number;
};
export type Output = {
  readonly latentEnthalpy: number;
  readonly iceMass: number;
  readonly iceFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    releasedEnthalpy: { type: "number" },
    sensibleEnthalpy: { type: "number", minimum: 0 },
    mass: { type: "number", exclusiveMinimum: 0 },
    suppliedLatentHeat: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "releasedEnthalpy",
    "sensibleEnthalpy",
    "mass",
    "suppliedLatentHeat",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    latentEnthalpy: { type: "number" },
    iceMass: { type: "number" },
    iceFraction: { type: "number" },
  },
  required: ["latentEnthalpy", "iceMass", "iceFraction"],
} as const;
/** Enthalpy allocation under explicitly supplied sensible and latent terms. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { releasedEnthalpy, sensibleEnthalpy, mass, suppliedLatentHeat } =
    request;
  const compute = (): Output => {
    H.positive(mass);
    H.positive(suppliedLatentHeat);
    H.domain(
      sensibleEnthalpy >= 0 &&
        releasedEnthalpy >= sensibleEnthalpy &&
        releasedEnthalpy - sensibleEnthalpy <= mass * suppliedLatentHeat,
    );
    return {
      latentEnthalpy: releasedEnthalpy - sensibleEnthalpy,
      iceMass: (releasedEnthalpy - sensibleEnthalpy) / suppliedLatentHeat,
      iceFraction:
        (releasedEnthalpy - sensibleEnthalpy) / (mass * suppliedLatentHeat),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    releasedEnthalpy: 500,
    sensibleEnthalpy: 100,
    mass: 2,
    suppliedLatentHeat: 400,
  },
  output: { latentEnthalpy: 400, iceMass: 1, iceFraction: 0.5 },
} satisfies ToolExample<Input, Output>;
export const freezingIceFractionSuppliedEnthalpyFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "food-technology/freezing-ice-fraction-supplied-enthalpy-factor",
      title: "Freezing Ice Fraction Supplied Enthalpy Factor Tool",
      description:
        "Enthalpy allocation under explicitly supplied sensible and latent terms.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          releasedEnthalpy: { type: "number" },
          sensibleEnthalpy: { type: "number", minimum: 0 },
          mass: { type: "number", exclusiveMinimum: 0 },
          suppliedLatentHeat: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "releasedEnthalpy",
          "sensibleEnthalpy",
          "mass",
          "suppliedLatentHeat",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          latentEnthalpy: { type: "number" },
          iceMass: { type: "number" },
          iceFraction: { type: "number" },
        },
        required: ["latentEnthalpy", "iceMass", "iceFraction"],
      },
      ports: {
        inputs: [
          {
            id: "releasedEnthalpy",
            label: "Released Enthalpy",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "sensibleEnthalpy",
            label: "Sensible Enthalpy",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "mass",
            label: "Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedLatentHeat",
            label: "Supplied Latent Heat",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "latentEnthalpy",
            label: "Latent Enthalpy",
            valueType: { type: "number" },
          },
          { id: "iceMass", label: "Ice Mass", valueType: { type: "number" } },
          {
            id: "iceFraction",
            label: "Ice Fraction",
            valueType: { type: "number", unit: "1" },
          },
        ],
      },
    },
    calculate,
  });
export const run = freezingIceFractionSuppliedEnthalpyFactorTool.execute;
export default freezingIceFractionSuppliedEnthalpyFactorTool;
