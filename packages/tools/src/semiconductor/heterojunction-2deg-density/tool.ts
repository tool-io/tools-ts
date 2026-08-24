import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const EPSILON_0_F_PER_CM = 8.854e-14;
const ELEMENTARY_CHARGE_C = 1.602176634e-19;

export type Heterojunction2degDensityInput = {
  readonly conductionBandOffsetEv: number;
  readonly relativePermittivity?: number;
  readonly separationNm: number;
};

export type Heterojunction2degDensityOutput = {
  readonly sheetDensityPerCm2: number;
};

export const heterojunction2degDensityExample = {
  input: { conductionBandOffsetEv: 0.3, separationNm: 30 },
  output: { sheetDensityPerCm2: 712883945354.055 },
} satisfies ToolExample<
  Heterojunction2degDensityInput,
  Heterojunction2degDensityOutput
>;

export const calculateHeterojunction2degDensity = (
  input: Heterojunction2degDensityInput,
): Heterojunction2degDensityOutput => {
  if (
    !Number.isFinite(input.conductionBandOffsetEv) ||
    input.conductionBandOffsetEv <= 0
  )
    simpleError(
      "conductionBandOffsetEv",
      "Conduction band offset must be positive.",
    );
  if (!Number.isFinite(input.separationNm) || input.separationNm <= 0)
    simpleError("separationNm", "Separation must be positive.");
  const relativePermittivity = input.relativePermittivity ?? 12.9;
  if (!Number.isFinite(relativePermittivity) || relativePermittivity <= 0)
    simpleError(
      "relativePermittivity",
      "Relative permittivity must be positive.",
    );
  const direct =
    (EPSILON_0_F_PER_CM * relativePermittivity * input.conductionBandOffsetEv) /
    (ELEMENTARY_CHARGE_C * input.separationNm * 1e-7);
  const sheetDensityPerCm2 =
    Number.isFinite(direct) && direct > 0
      ? direct
      : Math.exp(
          Math.log(EPSILON_0_F_PER_CM) +
            Math.log(relativePermittivity) +
            Math.log(input.conductionBandOffsetEv) -
            Math.log(ELEMENTARY_CHARGE_C) -
            Math.log(input.separationNm) -
            Math.log(1e-7),
        );
  if (!Number.isFinite(sheetDensityPerCm2) || sheetDensityPerCm2 <= 0)
    simpleError(
      "conductionBandOffsetEv",
      "The resulting sheet density is outside the representable range.",
      "numeric_range",
    );
  return { sheetDensityPerCm2 };
};

export const heterojunction2degDensityTool = createSimpleTool({
  calculate: (input) =>
    calculateHeterojunction2degDensity({
      conductionBandOffsetEv: input.conductionBandOffsetEv as number,
      relativePermittivity: input.relativePermittivity as number,
      separationNm: input.separationNm as number,
    }),
  description:
    "Estimate two-dimensional electron gas sheet density with a parallel-plate capacitor model that treats the band offset as the voltage dropped across the spacer.",
  id: "semiconductor/heterojunction-2deg-density",
  inputs: [
    {
      description: "Conduction band offset at the heterointerface.",
      id: "conductionBandOffsetEv",
      kind: "number",
      label: "Conduction band offset",
      minimum: Number.MIN_VALUE,
      unit: "eV",
    },
    {
      default: 12.9,
      description: "Semiconductor relative permittivity.",
      id: "relativePermittivity",
      kind: "number",
      label: "Relative permittivity",
      minimum: Number.MIN_VALUE,
      unit: "ratio",
    },
    {
      description: "Donor-to-channel separation.",
      id: "separationNm",
      kind: "number",
      label: "Separation",
      minimum: Number.MIN_VALUE,
      unit: "nm",
    },
  ],
  outputs: [
    {
      description:
        "Idealized sheet density before subband, Fermi-level, depletion, and incomplete-transfer corrections.",
      format: "density-per-cm2",
      id: "sheetDensityPerCm2",
      kind: "number",
      label: "Sheet density",
      minimum: Number.MIN_VALUE,
      unit: "cm^-2",
    },
  ],
  title: "2DEG Density Calculator",
});
export const runHeterojunction2degDensity =
  heterojunction2degDensityTool.execute;
export default heterojunction2degDensityTool;
