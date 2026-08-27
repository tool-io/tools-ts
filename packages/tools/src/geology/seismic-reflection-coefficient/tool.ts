import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SeismicReflectionCoefficientInput = {
  readonly pVelocity1MPers: number;
  readonly density1KgPerM3: number;
  readonly pVelocity2MPers: number;
  readonly density2KgPerM3: number;
};

export type SeismicReflectionCoefficientOutput = {
  readonly reflectionCoefficient: number;
  readonly acousticImpedance1PascalSecondPerMeter: number;
  readonly acousticImpedance2PascalSecondPerMeter: number;
};

export const calculateSeismicReflectionCoefficient = (
  input: SeismicReflectionCoefficientInput,
): SeismicReflectionCoefficientOutput => {
  if (!(input.pVelocity1MPers > 0))
    return simpleError(
      "pVelocity1MPers",
      "P-wave velocity must be greater than zero.",
      "invalid_velocity",
    );
  if (!(input.density1KgPerM3 > 0))
    return simpleError(
      "density1KgPerM3",
      "Density must be greater than zero.",
      "invalid_density",
    );
  if (!(input.pVelocity2MPers > 0))
    return simpleError(
      "pVelocity2MPers",
      "P-wave velocity must be greater than zero.",
      "invalid_velocity",
    );
  if (!(input.density2KgPerM3 > 0))
    return simpleError(
      "density2KgPerM3",
      "Density must be greater than zero.",
      "invalid_density",
    );
  const impedance1 = input.pVelocity1MPers * input.density1KgPerM3;
  const impedance2 = input.pVelocity2MPers * input.density2KgPerM3;
  return {
    reflectionCoefficient:
      (impedance2 - impedance1) / (impedance2 + impedance1),
    acousticImpedance1PascalSecondPerMeter: impedance1,
    acousticImpedance2PascalSecondPerMeter: impedance2,
  };
};

export const seismicReflectionCoefficientExample = {
  input: {
    pVelocity1MPers: 2500,
    density1KgPerM3: 2200,
    pVelocity2MPers: 4000,
    density2KgPerM3: 2400,
  },
  output: {
    reflectionCoefficient: 0.271523178807947,
    acousticImpedance1PascalSecondPerMeter: 5500000,
    acousticImpedance2PascalSecondPerMeter: 9600000,
  },
} satisfies ToolExample<
  SeismicReflectionCoefficientInput,
  SeismicReflectionCoefficientOutput
>;

export const seismicReflectionCoefficientTool = createSimpleTool({
  id: "geology/seismic-reflection-coefficient",
  title: "Seismic Reflection Coefficient Calculator",
  description:
    "Normal-incidence P-wave reflection coefficient R = (Z2 - Z1) / (Z2 + Z1) from layer velocities in meters per second and bulk densities in kilograms per cubic meter, where Z is acoustic impedance.",
  inputs: [
    {
      description: "P-wave velocity of the upper layer in meters per second.",
      id: "pVelocity1MPers",
      kind: "number",
      label: "Vp1",
      minimum: 0,
    },
    {
      description:
        "Bulk density of the upper layer in kilograms per cubic meter.",
      id: "density1KgPerM3",
      kind: "number",
      label: "rho1",
      minimum: 0,
    },
    {
      description: "P-wave velocity of the lower layer in meters per second.",
      id: "pVelocity2MPers",
      kind: "number",
      label: "Vp2",
      minimum: 0,
    },
    {
      description:
        "Bulk density of the lower layer in kilograms per cubic meter.",
      id: "density2KgPerM3",
      kind: "number",
      label: "rho2",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Normal-incidence reflection coefficient, dimensionless.",
      id: "reflectionCoefficient",
      kind: "number",
      label: "R",
    },
    {
      description:
        "Acoustic impedance of the upper layer in pascal seconds per meter.",
      id: "acousticImpedance1PascalSecondPerMeter",
      kind: "number",
      label: "Z1",
    },
    {
      description:
        "Acoustic impedance of the lower layer in pascal seconds per meter.",
      id: "acousticImpedance2PascalSecondPerMeter",
      kind: "number",
      label: "Z2",
    },
  ],
  calculate: (input) =>
    calculateSeismicReflectionCoefficient(
      input as unknown as SeismicReflectionCoefficientInput,
    ),
});

export const runSeismicReflectionCoefficient =
  seismicReflectionCoefficientTool.execute;
export default seismicReflectionCoefficientTool;
