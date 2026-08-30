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
  readonly freshLeafGrams: number;
  readonly dryLeafGrams: number;
  readonly dryMatterProteinFraction: number;
  readonly callerWaterFractionBounds: readonly number[];
  readonly callerMinimumProteinGramsPer100Fresh: number;
}>;
export type Output = Readonly<{
  readonly waterMassFraction: number;
  readonly proteinGramsPer100Fresh: number;
  readonly withinCallerMoistureBand: boolean;
  readonly meetsCallerFreshProteinThreshold: boolean;
}>;
const inputFields = [
  { id: "freshLeafGrams", label: "Fresh leaf grams", kind: "number" },
  { id: "dryLeafGrams", label: "Dry leaf grams", kind: "number" },
  {
    id: "dryMatterProteinFraction",
    label: "Dry matter protein fraction",
    kind: "number",
  },
  {
    id: "callerWaterFractionBounds",
    label: "Caller water fraction bounds",
    kind: "numberList",
  },
  {
    id: "callerMinimumProteinGramsPer100Fresh",
    label: "Caller minimum protein grams per100 fresh",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.freshLeafGrams, "freshLeafGrams");
  nonnegative(input.dryLeafGrams, "dryLeafGrams");
  nonnegative(
    input.callerMinimumProteinGramsPer100Fresh,
    "callerMinimumProteinGramsPer100Fresh",
  );
  fraction(input.dryMatterProteinFraction, "dryMatterProteinFraction");
  input.callerWaterFractionBounds.forEach((v) =>
    fraction(v, "callerWaterFractionBounds"),
  );
  if (
    input.dryLeafGrams > input.freshLeafGrams ||
    input.callerWaterFractionBounds.length !== 2 ||
    input.callerWaterFractionBounds[0] > input.callerWaterFractionBounds[1]
  )
    simpleError(
      "dryLeafGrams",
      "Dry mass ≤ fresh and ordered two-bound moisture band required.",
    );
  const waterMassFraction = 1 - input.dryLeafGrams / input.freshLeafGrams,
    proteinGramsPer100Fresh =
      (100 * input.dryLeafGrams * input.dryMatterProteinFraction) /
      input.freshLeafGrams;
  return {
    waterMassFraction,
    proteinGramsPer100Fresh,
    withinCallerMoistureBand:
      waterMassFraction >= input.callerWaterFractionBounds[0] &&
      waterMassFraction <= input.callerWaterFractionBounds[1],
    meetsCallerFreshProteinThreshold:
      proteinGramsPer100Fresh >= input.callerMinimumProteinGramsPer100Fresh,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  freshLeafGrams: 100,
  dryLeafGrams: 30,
  dryMatterProteinFraction: 0.2,
  callerWaterFractionBounds: [0.6, 0.8],
  callerMinimumProteinGramsPer100Fresh: 5,
} satisfies Input;
export const exampleOutput = {
  waterMassFraction: 0.7,
  proteinGramsPer100Fresh: 6,
  withinCallerMoistureBand: true,
  meetsCallerFreshProteinThreshold: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sericulture/leaf-moisture-nutrition-checker",
  title: "Leaf Moisture Nutrition Checker",
  description:
    "Screen moisture plus dry-assay-to-fresh protein against caller criteria; distinct from existing standalone leaf dry-matter content, with no nutritional adequacy diagnosis.",
  inputs: inputFields,
  outputs: [
    { id: "waterMassFraction", label: "Water mass fraction", kind: "number" },
    {
      id: "proteinGramsPer100Fresh",
      label: "Protein grams per100 fresh",
      kind: "number",
    },
    {
      id: "withinCallerMoistureBand",
      label: "Within caller moisture band",
      kind: "boolean",
    },
    {
      id: "meetsCallerFreshProteinThreshold",
      label: "Meets caller fresh protein threshold",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      freshLeafGrams: value.freshLeafGrams as number,
      dryLeafGrams: value.dryLeafGrams as number,
      dryMatterProteinFraction: value.dryMatterProteinFraction as number,
      callerWaterFractionBounds:
        value.callerWaterFractionBounds as readonly number[],
      callerMinimumProteinGramsPer100Fresh:
        value.callerMinimumProteinGramsPer100Fresh as number,
    }),
});
export const run = tool.execute;
export default tool;
