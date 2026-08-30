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
  readonly coproliteDryMassGrams: number;
  readonly measuredPhosphorusMassPercent: number;
  readonly backgroundPhosphorusMassPercent: number;
  readonly phosphateMineralPhosphorusMassFraction: number;
}>;
export type Output = Readonly<{
  readonly backgroundCorrectedPhosphorusMassGrams: number;
  readonly modelEquivalentPhosphateMassGrams: number;
  readonly modelEquivalentPhosphateDryMassPercent: number;
}>;
const inputFields = [
  {
    id: "coproliteDryMassGrams",
    label: "Coprolite dry mass grams",
    kind: "number",
  },
  {
    id: "measuredPhosphorusMassPercent",
    label: "Measured phosphorus mass percent",
    kind: "number",
  },
  {
    id: "backgroundPhosphorusMassPercent",
    label: "Background phosphorus mass percent",
    kind: "number",
  },
  {
    id: "phosphateMineralPhosphorusMassFraction",
    label: "Phosphate mineral phosphorus mass fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.coproliteDryMassGrams, "coproliteDryMassGrams");
  positive(
    input.phosphateMineralPhosphorusMassFraction,
    "phosphateMineralPhosphorusMassFraction",
  );
  nonnegative(
    input.measuredPhosphorusMassPercent,
    "measuredPhosphorusMassPercent",
  );
  nonnegative(
    input.backgroundPhosphorusMassPercent,
    "backgroundPhosphorusMassPercent",
  );
  fraction(
    input.phosphateMineralPhosphorusMassFraction,
    "phosphateMineralPhosphorusMassFraction",
  );
  if (
    input.measuredPhosphorusMassPercent > 100 ||
    input.backgroundPhosphorusMassPercent > 100
  )
    simpleError(
      "assays",
      "Phosphorus mass percentages within [0,100] required.",
    );
  const backgroundCorrectedPhosphorusMassGrams =
      (input.coproliteDryMassGrams *
        (input.measuredPhosphorusMassPercent -
          input.backgroundPhosphorusMassPercent)) /
      100,
    modelEquivalentPhosphateMassGrams =
      backgroundCorrectedPhosphorusMassGrams /
      input.phosphateMineralPhosphorusMassFraction;
  return {
    backgroundCorrectedPhosphorusMassGrams,
    modelEquivalentPhosphateMassGrams,
    modelEquivalentPhosphateDryMassPercent:
      (100 * modelEquivalentPhosphateMassGrams) / input.coproliteDryMassGrams,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  coproliteDryMassGrams: 10,
  measuredPhosphorusMassPercent: 3,
  backgroundPhosphorusMassPercent: 1,
  phosphateMineralPhosphorusMassFraction: 0.2,
} satisfies Input;
export const exampleOutput = {
  backgroundCorrectedPhosphorusMassGrams: 0.2,
  modelEquivalentPhosphateMassGrams: 1,
  modelEquivalentPhosphateDryMassPercent: 10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleontology/coprolite-phosphate-estimate",
  title: "Coprolite Phosphatic Content Bulk Estimate",
  description:
    "Report a background-corrected equivalent phosphate-mineral mass on caller phosphorus stoichiometry; signed nondetections and values above physical mass fraction are model diagnostics, not actual mineral identification or coprolite authenticity.",
  inputs: inputFields,
  outputs: [
    {
      id: "backgroundCorrectedPhosphorusMassGrams",
      label: "Background corrected phosphorus mass grams",
      kind: "number",
    },
    {
      id: "modelEquivalentPhosphateMassGrams",
      label: "Model equivalent phosphate mass grams",
      kind: "number",
    },
    {
      id: "modelEquivalentPhosphateDryMassPercent",
      label: "Model equivalent phosphate dry mass percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      coproliteDryMassGrams: value.coproliteDryMassGrams as number,
      measuredPhosphorusMassPercent:
        value.measuredPhosphorusMassPercent as number,
      backgroundPhosphorusMassPercent:
        value.backgroundPhosphorusMassPercent as number,
      phosphateMineralPhosphorusMassFraction:
        value.phosphateMineralPhosphorusMassFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
