import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  ownReference,
} from "../batch52-shared.js";
export type Input = Readonly<{
  callerVerifiedSource: string;
  callerVerifiedContext: string;
  callerVerifiedAsOfDate: string;
  emissionPeakWavelengthNm: number;
  bulkBandgapEv: number;
  callerKineticCoefficientEvNm2: number;
  callerCoulombCoefficientEvNm: number;
  callerStokesLossEv: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerVerifiedSource",
    label: "Independently verified model source",
    kind: "string",
  },
  {
    id: "callerVerifiedContext",
    label: "Material, surface, temperature and model context",
    kind: "string",
  },
  {
    id: "callerVerifiedAsOfDate",
    label: "Reference as-of date",
    kind: "string",
  },
  {
    id: "emissionPeakWavelengthNm",
    label: "Photoluminescence emission peak wavelength nm",
    kind: "number",
  },
  { id: "bulkBandgapEv", label: "Applicable bulk bandgap eV", kind: "number" },
  {
    id: "callerKineticCoefficientEvNm2",
    label: "Qualified inverse-square kinetic coefficient eV nm²",
    kind: "number",
  },
  {
    id: "callerCoulombCoefficientEvNm",
    label: "Qualified Coulomb coefficient eV nm",
    kind: "number",
  },
  {
    id: "callerStokesLossEv",
    label: "Independently established emission Stokes loss eV",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  ownReference(
    i.callerVerifiedSource,
    i.callerVerifiedContext,
    i.callerVerifiedAsOfDate,
  );
  positive(i.emissionPeakWavelengthNm, "emissionPeakWavelengthNm");
  positive(i.bulkBandgapEv, "bulkBandgapEv");
  positive(i.callerKineticCoefficientEvNm2, "callerKineticCoefficientEvNm2");
  nonnegative(i.callerCoulombCoefficientEvNm, "callerCoulombCoefficientEvNm");
  nonnegative(i.callerStokesLossEv, "callerStokesLossEv");
  const photonEnergyEv = 1239.841984 / i.emissionPeakWavelengthNm;
  const confinementExcessEv = positive(
    photonEnergyEv + i.callerStokesLossEv - i.bulkBandgapEv,
    "confinementExcessEv",
  );
  // Positive root of excess*r² + B*r - A = 0, without subtractive cancellation.
  const a = i.callerKineticCoefficientEvNm2,
    b = i.callerCoulombCoefficientEvNm;
  const radius = positive(
    (2 * a) /
      (Math.hypot(b, 2 * Math.sqrt(a) * Math.sqrt(confinementExcessEv)) + b),
    "radius",
  );
  return finish({
    result: {
      photonEnergyEv,
      confinementExcessEv,
      conditionalRadiusNm: radius,
      conditionalDiameterNm: 2 * radius,
    },
  });
};
export const example = {
  input: {
    callerVerifiedSource: "illustrative-qualified-emission-model/edition",
    callerVerifiedContext:
      "Illustrative independently established material-specific effective-mass emission model, not CdSe absorption calibration.",
    callerVerifiedAsOfDate: "2026-01-01",
    emissionPeakWavelengthNm: 619.920992,
    bulkBandgapEv: 1,
    callerKineticCoefficientEvNm2: 2,
    callerCoulombCoefficientEvNm: 1,
    callerStokesLossEv: 0,
  },
  output: {
    result: {
      photonEnergyEv: 2,
      confinementExcessEv: 1,
      conditionalRadiusNm: 1,
      conditionalDiameterNm: 2,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/quantum-dot-size-from-emission",
  title: "Semiconductor Quantum Dot Size From Emission Calculator",
  description:
    "Invert a caller independently applicable emission effective-mass model E_em=E_bulk+A/r²-B/r-StokesLoss on its positive confinement branch. Source-qualified material coefficients and Stokes loss required; not the existing CdSe first-exciton absorption calibration, a universal size law, spectral-peak detector or fabrication recommendation.",
  inputs: fields,
  outputs: [
    { id: "result", label: "Conditional emission-model size", kind: "object" },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
