import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SeismicAcousticImpedanceInput = {
  readonly pVelocityMPers: number;
  readonly bulkDensityKgPerM3: number;
};

export type SeismicAcousticImpedanceOutput = {
  readonly acousticImpedancePascalSecondPerMeter: number;
};

export const calculateSeismicAcousticImpedance = (
  input: SeismicAcousticImpedanceInput,
): SeismicAcousticImpedanceOutput => {
  if (!(input.pVelocityMPers > 0))
    return simpleError(
      "pVelocityMPers",
      "P-wave velocity must be greater than zero.",
      "invalid_velocity",
    );
  if (!(input.bulkDensityKgPerM3 > 0))
    return simpleError(
      "bulkDensityKgPerM3",
      "Bulk density must be greater than zero.",
      "invalid_density",
    );
  return {
    acousticImpedancePascalSecondPerMeter:
      input.pVelocityMPers * input.bulkDensityKgPerM3,
  };
};

export const seismicAcousticImpedanceExample = {
  input: { pVelocityMPers: 3000, bulkDensityKgPerM3: 2300 },
  output: { acousticImpedancePascalSecondPerMeter: 6900000 },
} satisfies ToolExample<
  SeismicAcousticImpedanceInput,
  SeismicAcousticImpedanceOutput
>;

export const seismicAcousticImpedanceTool = createSimpleTool({
  id: "geology/seismic-acoustic-impedance",
  title: "Seismic Acoustic Impedance Calculator",
  description:
    "Acoustic impedance Z = rho Vp from P-wave velocity in meters per second and bulk density in kilograms per cubic meter, returned in pascal seconds per meter.",
  inputs: [
    {
      description: "P-wave velocity in meters per second.",
      id: "pVelocityMPers",
      kind: "number",
      label: "Vp",
      minimum: 0,
    },
    {
      description: "Bulk density in kilograms per cubic meter.",
      id: "bulkDensityKgPerM3",
      kind: "number",
      label: "rho",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Acoustic impedance in pascal seconds per meter.",
      id: "acousticImpedancePascalSecondPerMeter",
      kind: "number",
      label: "Z",
    },
  ],
  calculate: (input) =>
    calculateSeismicAcousticImpedance(
      input as unknown as SeismicAcousticImpedanceInput,
    ),
});

export const runSeismicAcousticImpedance = seismicAcousticImpedanceTool.execute;
export default seismicAcousticImpedanceTool;
