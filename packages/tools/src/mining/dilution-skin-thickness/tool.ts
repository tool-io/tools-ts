import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, fraction, count } from "../shared.js";
export type Input = Readonly<{
  readonly oreWidthM: number;
  readonly oreDensityTonnesPerM3: number;
  readonly diluentDensityTonnesPerM3: number;
  readonly targetDiluentMassFraction: number;
  readonly dilutionFaceCount: number;
}>;
export type Output = Readonly<{
  readonly perFaceSkinThicknessM: number;
  readonly totalExtraWidthM: number;
}>;
const inputFields = [
  { id: "oreWidthM", label: "Ore width m", kind: "number" },
  {
    id: "oreDensityTonnesPerM3",
    label: "Ore density tonnes per m3",
    kind: "number",
  },
  {
    id: "diluentDensityTonnesPerM3",
    label: "Diluent density tonnes per m3",
    kind: "number",
  },
  {
    id: "targetDiluentMassFraction",
    label: "Target diluent mass fraction",
    kind: "number",
  },
  { id: "dilutionFaceCount", label: "Dilution face count", kind: "integer" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.oreWidthM, "oreWidthM");
  positive(input.oreDensityTonnesPerM3, "oreDensityTonnesPerM3");
  positive(input.diluentDensityTonnesPerM3, "diluentDensityTonnesPerM3");
  positive(input.dilutionFaceCount, "dilutionFaceCount");
  fraction(input.targetDiluentMassFraction, "targetDiluentMassFraction");
  count(input.dilutionFaceCount, "dilutionFaceCount");
  if (input.targetDiluentMassFraction === 1)
    simpleError("targetDiluentMassFraction", "Fraction below one required.");
  const totalExtraWidthM =
    (((input.oreWidthM * input.oreDensityTonnesPerM3) /
      input.diluentDensityTonnesPerM3) *
      input.targetDiluentMassFraction) /
    (1 - input.targetDiluentMassFraction);
  return {
    perFaceSkinThicknessM: totalExtraWidthM / input.dilutionFaceCount,
    totalExtraWidthM,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  oreWidthM: 4,
  oreDensityTonnesPerM3: 3,
  diluentDensityTonnesPerM3: 2,
  targetDiluentMassFraction: 0.2,
  dilutionFaceCount: 2,
} satisfies Input;
export const exampleOutput = {
  perFaceSkinThicknessM: 0.75,
  totalExtraWidthM: 1.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/dilution-skin-thickness",
  title: "Dilution Skin Thickness",
  description:
    "Invert planar ore/diluent mass fraction to equal skin thickness on supplied faces; constant area/density, distinct from forward grade mixing.",
  inputs: inputFields,
  outputs: [
    {
      id: "perFaceSkinThicknessM",
      label: "Per face skin thickness m",
      kind: "number",
    },
    { id: "totalExtraWidthM", label: "Total extra width m", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      oreWidthM: value.oreWidthM as number,
      oreDensityTonnesPerM3: value.oreDensityTonnesPerM3 as number,
      diluentDensityTonnesPerM3: value.diluentDensityTonnesPerM3 as number,
      targetDiluentMassFraction: value.targetDiluentMassFraction as number,
      dilutionFaceCount: value.dilutionFaceCount as number,
    }),
});
export const run = tool.execute;
export default tool;
