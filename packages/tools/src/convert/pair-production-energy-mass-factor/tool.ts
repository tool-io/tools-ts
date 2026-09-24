import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly singleParticleMass: number;
  readonly speedOfLight: number;
  readonly suppliedEnergyPerBase: number;
};
export type Output = {
  readonly pairRestEnergy: number;
  readonly convertedEnergy: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    singleParticleMass: { type: "number", minimum: 0 },
    speedOfLight: { type: "number", exclusiveMinimum: 0 },
    suppliedEnergyPerBase: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["singleParticleMass", "speedOfLight", "suppliedEnergyPerBase"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pairRestEnergy: { type: "number" },
    convertedEnergy: { type: "number" },
  },
  required: ["pairRestEnergy", "convertedEnergy"],
} as const;
/** Pair rest-energy equivalent only, with caller-supplied constants and units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { singleParticleMass, speedOfLight, suppliedEnergyPerBase } = request;
  const compute = (): Output => {
    H.domain(singleParticleMass >= 0);
    H.positive(speedOfLight);
    H.positive(suppliedEnergyPerBase);
    return {
      pairRestEnergy: 2 * singleParticleMass * speedOfLight ** 2,
      convertedEnergy:
        2 * singleParticleMass * speedOfLight ** 2 * suppliedEnergyPerBase,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { singleParticleMass: 2, speedOfLight: 3, suppliedEnergyPerBase: 10 },
  output: { pairRestEnergy: 36, convertedEnergy: 360 },
} satisfies ToolExample<Input, Output>;
export const pairProductionEnergyMassFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "convert/pair-production-energy-mass-factor",
    title: "Pair Production Energy Mass Factor Tool",
    description:
      "Pair rest-energy equivalent only, with caller-supplied constants and units.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        singleParticleMass: { type: "number", minimum: 0 },
        speedOfLight: { type: "number", exclusiveMinimum: 0 },
        suppliedEnergyPerBase: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["singleParticleMass", "speedOfLight", "suppliedEnergyPerBase"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pairRestEnergy: { type: "number" },
        convertedEnergy: { type: "number" },
      },
      required: ["pairRestEnergy", "convertedEnergy"],
    },
    ports: {
      inputs: [
        {
          id: "singleParticleMass",
          label: "Single Particle Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "speedOfLight",
          label: "Speed Of Light",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedEnergyPerBase",
          label: "Supplied Energy Per Base",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "pairRestEnergy",
          label: "Pair Rest Energy",
          valueType: { type: "number" },
        },
        {
          id: "convertedEnergy",
          label: "Converted Energy",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pairProductionEnergyMassFactorTool.execute;
export default pairProductionEnergyMassFactorTool;
