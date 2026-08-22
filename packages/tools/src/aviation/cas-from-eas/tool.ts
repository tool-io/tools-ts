import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CasFromEasInput = {
  readonly equivalentAirspeedKt: number;
  readonly pressureAltitudeFt: number;
};

export type CasFromEasOutput = {
  readonly casKt: number;
};

const GAMMA_AIR = 1.4;
const DRY_AIR_GAS_CONSTANT = 287.05287;
const MS_PER_KT = 0.514444;
const ISA_SEA_LEVEL_TEMPERATURE_K = 288.15;
const TROPOPAUSE_LAPSE_RATE_K_PER_FT = 0.0019812;
const PRESSURE_EXPONENT = 4.2561;
const PRESSURE_COEFFICIENT_PER_FT = 6.8755856e-6;

export const casFromEasExample = {
  input: { equivalentAirspeedKt: 200, pressureAltitudeFt: 10000 },
  output: { casKt: 241.17512963837441 },
} satisfies ToolExample<CasFromEasInput, CasFromEasOutput>;

export const calculateCasFromEas = (
  input: CasFromEasInput,
): CasFromEasOutput => {
  if (input.equivalentAirspeedKt <= 0)
    simpleError(
      "equivalentAirspeedKt",
      "The equivalent airspeed must be greater than zero.",
      "invalid_equivalent_airspeed",
    );
  const sigma = Math.pow(
    1 - PRESSURE_COEFFICIENT_PER_FT * input.pressureAltitudeFt,
    PRESSURE_EXPONENT,
  );
  const tasMs = (input.equivalentAirspeedKt * MS_PER_KT) / Math.sqrt(sigma);
  const temperatureK =
    ISA_SEA_LEVEL_TEMPERATURE_K -
    TROPOPAUSE_LAPSE_RATE_K_PER_FT * input.pressureAltitudeFt;
  const machNumber =
    tasMs / Math.sqrt(GAMMA_AIR * DRY_AIR_GAS_CONSTANT * temperatureK);
  const qcRatio = Math.pow(1 + 0.2 * machNumber ** 2, 3.5) - 1;
  const casMs = Math.sqrt(
    5 *
      GAMMA_AIR *
      DRY_AIR_GAS_CONSTANT *
      ISA_SEA_LEVEL_TEMPERATURE_K *
      (Math.pow(qcRatio + 1, 2 / 7) - 1),
  );
  return { casKt: casMs / MS_PER_KT };
};

export const casFromEasTool = createSimpleTool({
  calculate: (input) =>
    calculateCasFromEas(input as unknown as CasFromEasInput),
  description:
    "Convert equivalent airspeed to calibrated airspeed through the compressible Rayleigh pitot relation.",
  id: "aviation/cas-from-eas",
  inputs: [
    {
      description: "Equivalent airspeed at the altitude.",
      id: "equivalentAirspeedKt",
      kind: "number",
      label: "EAS",
      minimum: 0,
      unit: "kt",
    },
    {
      description: "Pressure altitude of the conversion.",
      id: "pressureAltitudeFt",
      kind: "number",
      label: "Pressure altitude",
      maximum: 36000,
      minimum: 0,
      unit: "ft",
    },
  ],
  outputs: [
    {
      description: "Calibrated airspeed indicated by the pitot-static system.",
      format: "speed",
      id: "casKt",
      kind: "number",
      label: "CAS",
      unit: "kt",
    },
  ],
  title: "CAS from EAS Calculator",
});
export const runCasFromEas = casFromEasTool.execute;
export default casFromEasTool;
