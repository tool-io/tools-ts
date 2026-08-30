import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, interpolate } from "../shared.js";
export type Input = Readonly<{
  readonly measuredWavelengthsNm: readonly number[];
  readonly measuredIndices: readonly number[];
  readonly shortReferenceWavelengthNm: number;
  readonly longReferenceWavelengthNm: number;
}>;
export type Output = Readonly<{
  readonly referenceIndexDispersion: number;
  readonly averageIndexSlopePerNm: number;
}>;
const inputFields = [
  {
    id: "measuredWavelengthsNm",
    label: "Measured wavelengths nm",
    kind: "numberList",
  },
  { id: "measuredIndices", label: "Measured indices", kind: "numberList" },
  {
    id: "shortReferenceWavelengthNm",
    label: "Short reference wavelength nm",
    kind: "number",
  },
  {
    id: "longReferenceWavelengthNm",
    label: "Long reference wavelength nm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.measuredWavelengthsNm.forEach((v) =>
    positive(v, "measuredWavelengthsNm"),
  );
  input.measuredIndices.forEach((v) => positive(v, "measuredIndices"));
  positive(input.shortReferenceWavelengthNm, "shortReferenceWavelengthNm");
  positive(input.longReferenceWavelengthNm, "longReferenceWavelengthNm");
  if (input.longReferenceWavelengthNm <= input.shortReferenceWavelengthNm)
    simpleError(
      "references",
      "Increasing short/long reference wavelengths required.",
    );
  const a = interpolate(
      input.measuredWavelengthsNm,
      input.measuredIndices,
      input.shortReferenceWavelengthNm,
    ),
    b = interpolate(
      input.measuredWavelengthsNm,
      input.measuredIndices,
      input.longReferenceWavelengthNm,
    );
  return {
    referenceIndexDispersion: a - b,
    averageIndexSlopePerNm:
      (b - a) /
      (input.longReferenceWavelengthNm - input.shortReferenceWavelengthNm),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredWavelengthsNm: [400, 700],
  measuredIndices: [1.6, 1.5],
  shortReferenceWavelengthNm: 400,
  longReferenceWavelengthNm: 700,
} satisfies Input;
export const exampleOutput = {
  referenceIndexDispersion: 0.1,
  averageIndexSlopePerNm: -0.0003333333333333333,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/dispersion-value",
  title: "Dispersion Fire Value",
  description:
    "Interpolate measured optical dispersion at caller two spectral references, retaining anomalous signed dispersion; no fixed mineral fire value or pulse-dispersion alias.",
  inputs: inputFields,
  outputs: [
    {
      id: "referenceIndexDispersion",
      label: "Reference index dispersion",
      kind: "number",
    },
    {
      id: "averageIndexSlopePerNm",
      label: "Average index slope per nm",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredWavelengthsNm: value.measuredWavelengthsNm as readonly number[],
      measuredIndices: value.measuredIndices as readonly number[],
      shortReferenceWavelengthNm: value.shortReferenceWavelengthNm as number,
      longReferenceWavelengthNm: value.longReferenceWavelengthNm as number,
    }),
});
export const run = tool.execute;
export default tool;
