import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly moleFraction: number;
  readonly pressurePa: number;
  readonly molarMassKgPerMol: number;
  readonly temperatureK: number;
  readonly gasConstant: number;
};
export type Output = {
  readonly molarDensity: number;
  readonly massDensity: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    moleFraction: { type: "number", minimum: 0, maximum: 1 },
    pressurePa: { type: "number", minimum: 0 },
    molarMassKgPerMol: { type: "number", exclusiveMinimum: 0 },
    temperatureK: { type: "number", exclusiveMinimum: 0 },
    gasConstant: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "moleFraction",
    "pressurePa",
    "molarMassKgPerMol",
    "temperatureK",
    "gasConstant",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    molarDensity: { type: "number" },
    massDensity: { type: "number" },
  },
  required: ["molarDensity", "massDensity"],
} as const;
/** Ideal-gas conversion from a unitless mole fraction to mol/m3 and kg/m3 with caller-supplied SI gas constant. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    moleFraction,
    pressurePa,
    molarMassKgPerMol,
    temperatureK,
    gasConstant,
  } = request;
  const compute = (): Output => {
    H.probability(moleFraction);
    H.domain(pressurePa >= 0);
    H.positive(molarMassKgPerMol);
    H.positive(temperatureK);
    H.positive(gasConstant);
    return {
      molarDensity: (moleFraction * pressurePa) / (gasConstant * temperatureK),
      massDensity:
        (moleFraction * pressurePa * molarMassKgPerMol) /
        (gasConstant * temperatureK),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    moleFraction: 0.000001,
    pressurePa: 100000,
    molarMassKgPerMol: 0.048,
    temperatureK: 300,
    gasConstant: 8,
  },
  output: { molarDensity: 0.000041666666666666665, massDensity: 0.000002 },
} satisfies ToolExample<Input, Output>;
export const ozoneMixingRatioMassDensityTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "atmospheric-chemistry/ozone-mixing-ratio-mass-density-term",
    title: "Ozone Mixing Ratio Mass Density Term Tool",
    description:
      "Ideal-gas conversion from a unitless mole fraction to mol/m3 and kg/m3 with caller-supplied SI gas constant.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        moleFraction: { type: "number", minimum: 0, maximum: 1 },
        pressurePa: { type: "number", minimum: 0 },
        molarMassKgPerMol: { type: "number", exclusiveMinimum: 0 },
        temperatureK: { type: "number", exclusiveMinimum: 0 },
        gasConstant: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "moleFraction",
        "pressurePa",
        "molarMassKgPerMol",
        "temperatureK",
        "gasConstant",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        molarDensity: { type: "number" },
        massDensity: { type: "number" },
      },
      required: ["molarDensity", "massDensity"],
    },
    ports: {
      inputs: [
        {
          id: "moleFraction",
          label: "Mole Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pressurePa",
          label: "Pressure Pa",
          required: true,
          valueType: { type: "number", unit: "Pa" },
        },
        {
          id: "molarMassKgPerMol",
          label: "Molar Mass Kg Per Mol",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "temperatureK",
          label: "Temperature K",
          required: true,
          valueType: { type: "number", unit: "K" },
        },
        {
          id: "gasConstant",
          label: "Gas Constant",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "molarDensity",
          label: "Molar Density",
          valueType: { type: "number" },
        },
        {
          id: "massDensity",
          label: "Mass Density",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = ozoneMixingRatioMassDensityTermTool.execute;
export default ozoneMixingRatioMassDensityTermTool;
