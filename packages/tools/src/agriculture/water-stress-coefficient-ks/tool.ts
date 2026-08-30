import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../shared.js";
export type Input = Readonly<{
  readonly totalRootZoneAvailableWaterMm: number;
  readonly currentRootZoneDepletionMm: number;
  readonly callerReadilyAvailableDepletionFraction: number;
}>;
export type Output = Readonly<{
  readonly readilyAvailableRootZoneWaterMm: number;
  readonly modelCropWaterStressCoefficient: number;
}>;
const inputFields = [
  {
    id: "totalRootZoneAvailableWaterMm",
    label: "Total root zone available water mm",
    kind: "number",
  },
  {
    id: "currentRootZoneDepletionMm",
    label: "Current root zone depletion mm",
    kind: "number",
  },
  {
    id: "callerReadilyAvailableDepletionFraction",
    label: "Caller readily available depletion fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.totalRootZoneAvailableWaterMm,
    "totalRootZoneAvailableWaterMm",
  );
  nonnegative(input.currentRootZoneDepletionMm, "currentRootZoneDepletionMm");
  fraction(
    input.callerReadilyAvailableDepletionFraction,
    "callerReadilyAvailableDepletionFraction",
  );
  if (
    input.callerReadilyAvailableDepletionFraction >= 1 ||
    input.currentRootZoneDepletionMm > input.totalRootZoneAvailableWaterMm
  )
    simpleError(
      "depletion",
      "Fraction below one and depletion within available root water required.",
    );
  const readilyAvailableRootZoneWaterMm =
      input.totalRootZoneAvailableWaterMm *
      input.callerReadilyAvailableDepletionFraction,
    modelCropWaterStressCoefficient =
      input.currentRootZoneDepletionMm <= readilyAvailableRootZoneWaterMm
        ? 1
        : (input.totalRootZoneAvailableWaterMm -
            input.currentRootZoneDepletionMm) /
          (input.totalRootZoneAvailableWaterMm -
            readilyAvailableRootZoneWaterMm);
  return { readilyAvailableRootZoneWaterMm, modelCropWaterStressCoefficient };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  totalRootZoneAvailableWaterMm: 100,
  currentRootZoneDepletionMm: 60,
  callerReadilyAvailableDepletionFraction: 0.5,
} satisfies Input;
export const exampleOutput = {
  readilyAvailableRootZoneWaterMm: 50,
  modelCropWaterStressCoefficient: 0.8,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/water-stress-coefficient-ks",
  title: "Agriculture Water Stress Coefficient Ks",
  description:
    "Evaluate named FAO-style root-zone depletion stress coefficient with caller readily available fraction; assumes known accessible TAW/depletion and does not diagnose actual plant health or choose irrigation timing.",
  inputs: inputFields,
  outputs: [
    {
      id: "readilyAvailableRootZoneWaterMm",
      label: "Readily available root zone water mm",
      kind: "number",
    },
    {
      id: "modelCropWaterStressCoefficient",
      label: "Model crop water stress coefficient",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      totalRootZoneAvailableWaterMm:
        value.totalRootZoneAvailableWaterMm as number,
      currentRootZoneDepletionMm: value.currentRootZoneDepletionMm as number,
      callerReadilyAvailableDepletionFraction:
        value.callerReadilyAvailableDepletionFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
