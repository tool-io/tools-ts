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
  bounded,
  aligned,
  sum,
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly currentBraceletLengthMm: number;
  readonly targetWornLengthMm: number;
  readonly removableLinkLengthsMm: readonly number[];
  readonly maximumLinksRemovablePerSize: readonly number[];
  readonly availableSignedClaspAdjustmentsMm: readonly number[];
  readonly callerFitToleranceMm: number;
}>;
export type Output = Readonly<{
  readonly chosenLinkRemovalCounts: readonly number[];
  readonly chosenSignedClaspAdjustmentMm: number;
  readonly resultingBraceletLengthMm: number;
  readonly signedResultMinusTargetMm: number;
  readonly fitWithinCallerTolerance: boolean;
}>;
const inputFields = [
  {
    id: "currentBraceletLengthMm",
    label: "Current bracelet length mm",
    kind: "number",
  },
  { id: "targetWornLengthMm", label: "Target worn length mm", kind: "number" },
  {
    id: "removableLinkLengthsMm",
    label: "Removable link lengths mm",
    kind: "numberList",
  },
  {
    id: "maximumLinksRemovablePerSize",
    label: "Maximum links removable per size",
    kind: "numberList",
  },
  {
    id: "availableSignedClaspAdjustmentsMm",
    label: "Available signed clasp adjustments mm",
    kind: "numberList",
  },
  {
    id: "callerFitToleranceMm",
    label: "Caller fit tolerance mm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.currentBraceletLengthMm, "currentBraceletLengthMm");
  positive(input.targetWornLengthMm, "targetWornLengthMm");
  input.removableLinkLengthsMm.forEach((v) =>
    positive(v, "removableLinkLengthsMm"),
  );
  nonnegative(input.callerFitToleranceMm, "callerFitToleranceMm");
  aligned(
    input.removableLinkLengthsMm,
    input.maximumLinksRemovablePerSize,
    "removableLinkLengthsMm",
  );
  if (
    input.removableLinkLengthsMm.length > 4 ||
    !input.availableSignedClaspAdjustmentsMm.length ||
    input.availableSignedClaspAdjustmentsMm.length > 32
  )
    simpleError(
      "scope",
      "1–4 link sizes, 1–32 measured clasp positions required.",
    );
  input.maximumLinksRemovablePerSize.forEach((v) => bounded(v, "links", 0, 20));
  let work = input.availableSignedClaspAdjustmentsMm.length;
  input.maximumLinksRemovablePerSize.forEach((v) => (work *= v + 1));
  if (work > 100000)
    simpleError(
      "scope",
      "More than 100000 fit candidates; narrow explicit link inventory.",
    );
  let bestCounts: number[] = [],
    bestAdjustment = 0,
    bestLength = 0,
    bestError = Infinity,
    bestCount = Infinity;
  const visit = (counts: number[], removed: number, index: number) => {
    if (index < input.removableLinkLengthsMm.length) {
      for (let n = 0; n <= input.maximumLinksRemovablePerSize[index]; n++)
        visit(
          [...counts, n],
          removed + n * input.removableLinkLengthsMm[index],
          index + 1,
        );
      return;
    }
    for (const adjustment of input.availableSignedClaspAdjustmentsMm) {
      const length = input.currentBraceletLengthMm - removed + adjustment;
      if (length <= 0) continue;
      const error = Math.abs(length - input.targetWornLengthMm),
        count = sum(counts);
      if (
        error < bestError ||
        (error === bestError &&
          (count < bestCount ||
            (count === bestCount &&
              Math.abs(adjustment) < Math.abs(bestAdjustment))))
      ) {
        bestError = error;
        bestCount = count;
        bestCounts = counts;
        bestAdjustment = adjustment;
        bestLength = length;
      }
    }
  };
  visit([], 0, 0);
  if (!Number.isFinite(bestError))
    simpleError(
      "fit",
      "No physically positive bracelet length within caller options.",
    );
  return {
    chosenLinkRemovalCounts: bestCounts,
    chosenSignedClaspAdjustmentMm: bestAdjustment,
    resultingBraceletLengthMm: bestLength,
    signedResultMinusTargetMm: bestLength - input.targetWornLengthMm,
    fitWithinCallerTolerance: bestError <= input.callerFitToleranceMm,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  currentBraceletLengthMm: 180,
  targetWornLengthMm: 170,
  removableLinkLengthsMm: [4, 6],
  maximumLinksRemovablePerSize: [2, 2],
  availableSignedClaspAdjustmentsMm: [0, -2, 2],
  callerFitToleranceMm: 1,
} satisfies Input;
export const exampleOutput = {
  chosenLinkRemovalCounts: [1, 1],
  chosenSignedClaspAdjustmentMm: 0,
  resultingBraceletLengthMm: 170,
  signedResultMinusTargetMm: 0,
  fitWithinCallerTolerance: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horology/bracelet-micro-adjust-clasp-link-removal-counter",
  title: "Bracelet Micro Adjust Clasp Link Removal Counter",
  description:
    "Search bounded actual removable-link/clasp inventory for nearest target fit, tie-break fewer removed links, smaller absolute clasp change, then stable caller enumeration; no physical work, universal wrist clearance, clasp retention or strap safety guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "chosenLinkRemovalCounts",
      label: "Chosen link removal counts",
      kind: "numberList",
    },
    {
      id: "chosenSignedClaspAdjustmentMm",
      label: "Chosen signed clasp adjustment mm",
      kind: "number",
    },
    {
      id: "resultingBraceletLengthMm",
      label: "Resulting bracelet length mm",
      kind: "number",
    },
    {
      id: "signedResultMinusTargetMm",
      label: "Signed result minus target mm",
      kind: "number",
    },
    {
      id: "fitWithinCallerTolerance",
      label: "Fit within caller tolerance",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      currentBraceletLengthMm: value.currentBraceletLengthMm as number,
      targetWornLengthMm: value.targetWornLengthMm as number,
      removableLinkLengthsMm: value.removableLinkLengthsMm as readonly number[],
      maximumLinksRemovablePerSize:
        value.maximumLinksRemovablePerSize as readonly number[],
      availableSignedClaspAdjustmentsMm:
        value.availableSignedClaspAdjustmentsMm as readonly number[],
      callerFitToleranceMm: value.callerFitToleranceMm as number,
    }),
});
export const run = tool.execute;
export default tool;
