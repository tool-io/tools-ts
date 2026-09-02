import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly firstCatalogueJulianEpoch: number;
  readonly secondCatalogueJulianEpoch: number;
}>;
export type Output = Readonly<{
  readonly signedEpochDifferenceJulianYears: number;
}>;
const inputFields = [
  {
    id: "firstCatalogueJulianEpoch",
    label: "First catalogue julian epoch",
    kind: "number",
  },
  {
    id: "secondCatalogueJulianEpoch",
    label: "Second catalogue julian epoch",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    signedEpochDifferenceJulianYears:
      input.secondCatalogueJulianEpoch - input.firstCatalogueJulianEpoch,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  firstCatalogueJulianEpoch: 2000,
  secondCatalogueJulianEpoch: 2016,
} satisfies Input;
export const exampleOutput = {
  signedEpochDifferenceJulianYears: 16,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/catalogue-epoch-mismatch-delta-calculator",
  title: "Astrometric Catalogue Epoch Mismatch Years Delta Calculator",
  description:
    "Signed second−first reference-epoch mismatch in same Julian epoch convention; no motion correction or Besselian/Julian mixing. Caller independently establishes frames, units, epoch, covariance and instrument context; not an identity, association or astrometric quality certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedEpochDifferenceJulianYears",
      label: "Signed epoch difference julian years",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      firstCatalogueJulianEpoch: value.firstCatalogueJulianEpoch as number,
      secondCatalogueJulianEpoch: value.secondCatalogueJulianEpoch as number,
    }),
});
export const run = tool.execute;
export default tool;
