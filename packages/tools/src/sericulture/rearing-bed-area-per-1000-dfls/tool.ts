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
  fraction,
  count,
  aligned,
  maximum,
} from "../shared.js";
export type Input = Readonly<{
  readonly diseaseFreeLayingCount: number;
  readonly eggsPerLaying: number;
  readonly hatchFraction: number;
  readonly survivalFractionsToStages: readonly number[];
  readonly larvaePerM2ByStage: readonly number[];
  readonly trayUsableAreaM2: number;
}>;
export type Output = Readonly<{
  readonly expectedLarvaeByStage: readonly number[];
  readonly requiredBedAreasM2: readonly number[];
  readonly wholeTrayCounts: readonly number[];
  readonly peakBedAreaPer1000DflM2: number;
}>;
const inputFields = [
  {
    id: "diseaseFreeLayingCount",
    label: "Disease free laying count",
    kind: "integer",
  },
  { id: "eggsPerLaying", label: "Eggs per laying", kind: "integer" },
  { id: "hatchFraction", label: "Hatch fraction", kind: "number" },
  {
    id: "survivalFractionsToStages",
    label: "Survival fractions to stages",
    kind: "numberList",
  },
  {
    id: "larvaePerM2ByStage",
    label: "Larvae per m2 by stage",
    kind: "numberList",
  },
  { id: "trayUsableAreaM2", label: "Tray usable area m2", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.diseaseFreeLayingCount, "diseaseFreeLayingCount");
  input.larvaePerM2ByStage.forEach((v) => positive(v, "larvaePerM2ByStage"));
  positive(input.trayUsableAreaM2, "trayUsableAreaM2");
  fraction(input.hatchFraction, "hatchFraction");
  input.survivalFractionsToStages.forEach((v) =>
    fraction(v, "survivalFractionsToStages"),
  );
  count(input.diseaseFreeLayingCount, "diseaseFreeLayingCount");
  count(input.eggsPerLaying, "eggsPerLaying");
  aligned(
    input.survivalFractionsToStages,
    input.larvaePerM2ByStage,
    "survivalFractionsToStages",
  );
  if (
    input.survivalFractionsToStages.some(
      (v, i) => i > 0 && v > input.survivalFractionsToStages[i - 1],
    )
  )
    simpleError(
      "survivalFractionsToStages",
      "Cumulative stage survival cannot increase.",
    );
  const hatch =
      input.diseaseFreeLayingCount * input.eggsPerLaying * input.hatchFraction,
    expectedLarvaeByStage = input.survivalFractionsToStages.map(
      (v) => hatch * v,
    ),
    requiredBedAreasM2 = expectedLarvaeByStage.map(
      (v, i) => v / input.larvaePerM2ByStage[i],
    );
  return {
    expectedLarvaeByStage,
    requiredBedAreasM2,
    wholeTrayCounts: requiredBedAreasM2.map((v) =>
      count(Math.ceil(v / input.trayUsableAreaM2), "trayCount"),
    ),
    peakBedAreaPer1000DflM2:
      (maximum(requiredBedAreasM2) / input.diseaseFreeLayingCount) * 1000,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  diseaseFreeLayingCount: 100,
  eggsPerLaying: 400,
  hatchFraction: 0.9,
  survivalFractionsToStages: [1, 0.8],
  larvaePerM2ByStage: [1000, 500],
  trayUsableAreaM2: 1,
} satisfies Input;
export const exampleOutput = {
  expectedLarvaeByStage: [36000, 28800],
  requiredBedAreasM2: [36, 57.6],
  wholeTrayCounts: [36, 58],
  peakBedAreaPer1000DflM2: 576,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sericulture/rearing-bed-area-per-1000-dfls",
  title: "Rearing Bed Area Per 1000 DFLs",
  description:
    "Plan stage-specific bed areas and whole trays per observed DFL/egg/hatch/survival scenario; DFL is an inventory label, not a disease-free certification or universal density.",
  inputs: inputFields,
  outputs: [
    {
      id: "expectedLarvaeByStage",
      label: "Expected larvae by stage",
      kind: "numberList",
    },
    {
      id: "requiredBedAreasM2",
      label: "Required bed areas m2",
      kind: "numberList",
    },
    { id: "wholeTrayCounts", label: "Whole tray counts", kind: "numberList" },
    {
      id: "peakBedAreaPer1000DflM2",
      label: "Peak bed area per1000 dfl m2",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      diseaseFreeLayingCount: value.diseaseFreeLayingCount as number,
      eggsPerLaying: value.eggsPerLaying as number,
      hatchFraction: value.hatchFraction as number,
      survivalFractionsToStages:
        value.survivalFractionsToStages as readonly number[],
      larvaePerM2ByStage: value.larvaePerM2ByStage as readonly number[],
      trayUsableAreaM2: value.trayUsableAreaM2 as number,
    }),
});
export const run = tool.execute;
export default tool;
