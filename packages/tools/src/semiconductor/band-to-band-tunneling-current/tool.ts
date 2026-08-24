import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BandToBandTunnelingCurrentInput = {
  readonly characteristicFieldMVPerCm?: number;
  readonly electricFieldMVPerCm: number;
  readonly tunnelingCoefficient?: number;
};

export type BandToBandTunnelingCurrentOutput = {
  readonly btbtNanoAmperes: number;
};

export const bandToBandTunnelingCurrentExample = {
  input: { electricFieldMVPerCm: 5 },
  output: { btbtNanoAmperes: 0.0016773131395125592 },
} satisfies ToolExample<
  BandToBandTunnelingCurrentInput,
  BandToBandTunnelingCurrentOutput
>;

export const calculateBandToBandTunnelingCurrent = (
  input: BandToBandTunnelingCurrentInput,
): BandToBandTunnelingCurrentOutput => {
  const electricFieldMVPerCm = input.electricFieldMVPerCm;
  const characteristicFieldMVPerCm = input.characteristicFieldMVPerCm ?? 40;
  const tunnelingCoefficient = input.tunnelingCoefficient ?? 1;

  if (!Number.isFinite(electricFieldMVPerCm) || electricFieldMVPerCm <= 0)
    simpleError(
      "electricFieldMVPerCm",
      "Electric field must be a finite number greater than 0 MV/cm.",
      "invalid_electric_field",
    );

  if (
    !Number.isFinite(characteristicFieldMVPerCm) ||
    characteristicFieldMVPerCm <= 0
  )
    simpleError(
      "characteristicFieldMVPerCm",
      "Characteristic field must be a finite positive number.",
      "invalid_characteristic_field",
    );

  if (!Number.isFinite(tunnelingCoefficient) || tunnelingCoefficient < 0)
    simpleError(
      "tunnelingCoefficient",
      "Tunneling coefficient must be a finite number at least 0 nA/(MV/cm).",
      "invalid_tunneling_coefficient",
    );

  const ratio = characteristicFieldMVPerCm / electricFieldMVPerCm;
  if (!Number.isFinite(ratio))
    simpleError(
      "electricFieldMVPerCm",
      "Field ratio overflowed.",
      "numeric_overflow",
    );

  const exponent = -ratio;
  if (!Number.isFinite(exponent))
    simpleError(
      "electricFieldMVPerCm",
      "Exponent overflowed.",
      "numeric_overflow",
    );

  const expVal = Math.exp(exponent);
  if (!Number.isFinite(expVal))
    simpleError(
      "electricFieldMVPerCm",
      "Exponential overflowed.",
      "numeric_overflow",
    );

  // Underflow to 0 is allowed (far below characteristic field)
  const fieldTimesExp = electricFieldMVPerCm * expVal;
  if (!Number.isFinite(fieldTimesExp))
    simpleError(
      "electricFieldMVPerCm",
      "Field times exponential overflowed.",
      "numeric_overflow",
    );

  const btbtNanoAmperes = tunnelingCoefficient * fieldTimesExp;
  if (!Number.isFinite(btbtNanoAmperes))
    simpleError(
      "tunnelingCoefficient",
      "BTBT current overflowed.",
      "numeric_overflow",
    );

  return { btbtNanoAmperes: btbtNanoAmperes === 0 ? 0 : btbtNanoAmperes };
};

export const bandToBandTunnelingCurrentTool = createSimpleTool({
  calculate: (input) =>
    calculateBandToBandTunnelingCurrent({
      characteristicFieldMVPerCm:
        (input.characteristicFieldMVPerCm as number | undefined) ?? undefined,
      electricFieldMVPerCm: input.electricFieldMVPerCm as number,
      tunnelingCoefficient:
        (input.tunnelingCoefficient as number | undefined) ?? undefined,
    }),
  description:
    "Estimate band-to-band tunneling current from the junction field through a field-driven exponential: I[nA]=coeff·E·exp(-E0/E) with E=electricFieldMVPerCm>0 MV/cm, E0=characteristicFieldMVPerCm>0 MV/cm, coeff=tunnelingCoefficient>=0 nA/(MV/cm). Defaults E0=40 MV/cm, coeff=1 nA/(MV/cm). Simplified Kane-like model; neglects barrier shape, temperature, and trap-assisted contributions; valid only for E comparable to E0 and for the fitted material.",
  id: "semiconductor/band-to-band-tunneling-current",
  inputs: [
    {
      default: 40,
      description:
        "Characteristic tunneling field of the material. Must be a finite number greater than 0 MV/cm.",
      id: "characteristicFieldMVPerCm",
      kind: "number",
      label: "Characteristic field",
      minimum: Number.MIN_VALUE,
      unit: "MV/cm",
    },
    {
      description:
        "Electric field across the tunneling junction. Must be a finite number greater than 0 MV/cm.",
      format: "electric-field-mv-per-cm",
      id: "electricFieldMVPerCm",
      kind: "number",
      label: "Electric field",
      minimum: Number.MIN_VALUE,
      unit: "MV/cm",
    },
    {
      default: 1,
      description:
        "Prefactor scaling the tunneling exponential. Must be a finite number at least 0 nA/(MV/cm).",
      id: "tunnelingCoefficient",
      kind: "number",
      label: "Tunneling coefficient",
      minimum: 0,
      unit: "nA/(MV/cm)",
    },
  ],
  outputs: [
    {
      description:
        "Band-to-band tunneling current (magnitude). At least 0 nA; underflow to 0 allowed.",
      format: "current-na",
      id: "btbtNanoAmperes",
      kind: "number",
      label: "BTBT current",
      minimum: 0,
      unit: "nA",
    },
  ],
  title: "Band-to-Band Tunneling Calculator",
});
export const runBandToBandTunnelingCurrent =
  bandToBandTunnelingCurrentTool.execute;
export default bandToBandTunnelingCurrentTool;
