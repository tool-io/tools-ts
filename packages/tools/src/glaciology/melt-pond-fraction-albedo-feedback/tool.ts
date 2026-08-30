import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, nonnegative, fraction } from "../shared.js";
export type Input = Readonly<{
  readonly pondFractions: readonly number[];
  readonly pondAlbedo: number;
  readonly unpondedIceAlbedo: number;
  readonly incomingShortwaveWattsPerM2: number;
}>;
export type Output = Readonly<{
  readonly effectiveAlbedos: readonly number[];
  readonly absorbedShortwaveWattsPerM2: readonly number[];
  readonly extraAbsorptionRelativeToUnpondedWattsPerM2: readonly number[];
}>;
const inputFields = [
  { id: "pondFractions", label: "Pond fractions", kind: "numberList" },
  { id: "pondAlbedo", label: "Pond albedo", kind: "number" },
  { id: "unpondedIceAlbedo", label: "Unponded ice albedo", kind: "number" },
  {
    id: "incomingShortwaveWattsPerM2",
    label: "Incoming shortwave watts per m2",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.incomingShortwaveWattsPerM2, "incomingShortwaveWattsPerM2");
  input.pondFractions.forEach((v) => fraction(v, "pondFractions"));
  fraction(input.pondAlbedo, "pondAlbedo");
  fraction(input.unpondedIceAlbedo, "unpondedIceAlbedo");
  if (!input.pondFractions.length)
    simpleError("pondFractions", "Nonempty pond fractions required.");
  const effectiveAlbedos = input.pondFractions.map(
      (f) => f * input.pondAlbedo + (1 - f) * input.unpondedIceAlbedo,
    ),
    absorbedShortwaveWattsPerM2 = effectiveAlbedos.map(
      (a) => input.incomingShortwaveWattsPerM2 * (1 - a),
    );
  return {
    effectiveAlbedos,
    absorbedShortwaveWattsPerM2,
    extraAbsorptionRelativeToUnpondedWattsPerM2: effectiveAlbedos.map(
      (a) => input.incomingShortwaveWattsPerM2 * (input.unpondedIceAlbedo - a),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  pondFractions: [0, 0.5, 1],
  pondAlbedo: 0.2,
  unpondedIceAlbedo: 0.6,
  incomingShortwaveWattsPerM2: 100,
} satisfies Input;
export const exampleOutput = {
  effectiveAlbedos: [0.6, 0.4, 0.2],
  absorbedShortwaveWattsPerM2: [40, 60, 80],
  extraAbsorptionRelativeToUnpondedWattsPerM2: [0, 20, 40],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/melt-pond-fraction-albedo-feedback",
  title: "Melt Pond Fraction Albedo Feedback",
  description:
    "Quantify area-weighted pond/ice albedo and incremental absorbed shortwave for supplied pond scenarios; no melt-rate or radiative-feedback climate prediction.",
  inputs: inputFields,
  outputs: [
    { id: "effectiveAlbedos", label: "Effective albedos", kind: "numberList" },
    {
      id: "absorbedShortwaveWattsPerM2",
      label: "Absorbed shortwave watts per m2",
      kind: "numberList",
    },
    {
      id: "extraAbsorptionRelativeToUnpondedWattsPerM2",
      label: "Extra absorption relative to unponded watts per m2",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      pondFractions: value.pondFractions as readonly number[],
      pondAlbedo: value.pondAlbedo as number,
      unpondedIceAlbedo: value.unpondedIceAlbedo as number,
      incomingShortwaveWattsPerM2: value.incomingShortwaveWattsPerM2 as number,
    }),
});
export const run = tool.execute;
export default tool;
