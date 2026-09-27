import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly integratedEnergy: number;
  readonly sampleMass: number;
  readonly dryFraction: number;
  readonly starchFractionDry: number;
};
export type Output = {
  readonly dryBasisEnthalpy: number;
  readonly starchBasisEnthalpy: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    integratedEnergy: { type: "number" },
    sampleMass: { type: "number", exclusiveMinimum: 0 },
    dryFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
    starchFractionDry: { type: "number", exclusiveMinimum: 0, maximum: 1 },
  },
  required: [
    "integratedEnergy",
    "sampleMass",
    "dryFraction",
    "starchFractionDry",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dryBasisEnthalpy: { type: "number" },
    starchBasisEnthalpy: { type: "number" },
  },
  required: ["dryBasisEnthalpy", "starchBasisEnthalpy"],
} as const;
/** Signed DSC integral normalized by explicitly supplied dry and starch mass fractions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { integratedEnergy, sampleMass, dryFraction, starchFractionDry } =
    request;
  const compute = (): Output => {
    H.positive(sampleMass);
    H.domain(
      dryFraction > 0 &&
        dryFraction <= 1 &&
        starchFractionDry > 0 &&
        starchFractionDry <= 1,
    );
    return {
      dryBasisEnthalpy: integratedEnergy / (sampleMass * dryFraction),
      starchBasisEnthalpy:
        integratedEnergy / (sampleMass * dryFraction * starchFractionDry),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    integratedEnergy: 12,
    sampleMass: 2,
    dryFraction: 0.8,
    starchFractionDry: 0.75,
  },
  output: { dryBasisEnthalpy: 7.5, starchBasisEnthalpy: 9.999999999999998 },
} satisfies ToolExample<Input, Output>;
export const starchGelatinizationDscMassFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "food-technology/starch-gelatinization-dsc-mass-factor",
    title: "Starch Gelatinization Dsc Mass Factor Tool",
    description:
      "Signed DSC integral normalized by explicitly supplied dry and starch mass fractions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        integratedEnergy: { type: "number" },
        sampleMass: { type: "number", exclusiveMinimum: 0 },
        dryFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
        starchFractionDry: { type: "number", exclusiveMinimum: 0, maximum: 1 },
      },
      required: [
        "integratedEnergy",
        "sampleMass",
        "dryFraction",
        "starchFractionDry",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dryBasisEnthalpy: { type: "number" },
        starchBasisEnthalpy: { type: "number" },
      },
      required: ["dryBasisEnthalpy", "starchBasisEnthalpy"],
    },
    ports: {
      inputs: [
        {
          id: "integratedEnergy",
          label: "Integrated Energy",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sampleMass",
          label: "Sample Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dryFraction",
          label: "Dry Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "starchFractionDry",
          label: "Starch Fraction Dry",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "dryBasisEnthalpy",
          label: "Dry Basis Enthalpy",
          valueType: { type: "number" },
        },
        {
          id: "starchBasisEnthalpy",
          label: "Starch Basis Enthalpy",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = starchGelatinizationDscMassFactorTool.execute;
export default starchGelatinizationDscMassFactorTool;
