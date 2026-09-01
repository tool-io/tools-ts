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
  aligned,
  unique,
  strictlyIncreasing,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly callerRootstockTrialIds: readonly string[];
  readonly matchedTrialShootDryMassGrams: readonly number[];
  readonly matchedReferenceShootDryMassGrams: readonly number[];
  readonly callerVigourRatioUpperEdges: readonly number[];
  readonly callerVigourClassLabels: readonly string[];
}>;
export type Output = Readonly<{
  readonly matchedTrialRelativeDryMassRatios: readonly number[];
  readonly callerTrialVigourClassLabels: readonly string[];
}>;
const inputFields = [
  {
    id: "callerRootstockTrialIds",
    label: "Caller rootstock trial ids",
    kind: "stringList",
  },
  {
    id: "matchedTrialShootDryMassGrams",
    label: "Matched trial shoot dry mass grams",
    kind: "numberList",
  },
  {
    id: "matchedReferenceShootDryMassGrams",
    label: "Matched reference shoot dry mass grams",
    kind: "numberList",
  },
  {
    id: "callerVigourRatioUpperEdges",
    label: "Caller vigour ratio upper edges",
    kind: "numberList",
  },
  {
    id: "callerVigourClassLabels",
    label: "Caller vigour class labels",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.matchedReferenceShootDryMassGrams.forEach((v) =>
    positive(v, "matchedReferenceShootDryMassGrams"),
  );
  input.callerVigourRatioUpperEdges.forEach((v) =>
    positive(v, "callerVigourRatioUpperEdges"),
  );
  input.matchedTrialShootDryMassGrams.forEach((v) =>
    nonnegative(v, "matchedTrialShootDryMassGrams"),
  );
  aligned(
    input.callerRootstockTrialIds,
    input.matchedTrialShootDryMassGrams,
    "callerRootstockTrialIds",
  );
  aligned(
    input.callerRootstockTrialIds,
    input.matchedReferenceShootDryMassGrams,
    "callerRootstockTrialIds",
  );
  unique(input.callerRootstockTrialIds, "trials");
  unique(input.callerVigourClassLabels, "classes");
  strictlyIncreasing(input.callerVigourRatioUpperEdges, "edges", 1);
  if (
    input.callerVigourClassLabels.length !==
    input.callerVigourRatioUpperEdges.length + 1
  )
    simpleError("classes", "One label beyond final inclusive edge required.");
  const ratios = input.matchedTrialShootDryMassGrams.map(
    (v, i) => v / input.matchedReferenceShootDryMassGrams[i],
  );
  return {
    matchedTrialRelativeDryMassRatios: ratios,
    callerTrialVigourClassLabels: ratios.map((v) => {
      const i = input.callerVigourRatioUpperEdges.findIndex(
        (edge) => v <= edge,
      );
      return input.callerVigourClassLabels[
        i < 0 ? input.callerVigourRatioUpperEdges.length : i
      ];
    }),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerRootstockTrialIds: ["a", "b"],
  matchedTrialShootDryMassGrams: [200, 100],
  matchedReferenceShootDryMassGrams: [100, 100],
  callerVigourRatioUpperEdges: [1, 1.5],
  callerVigourClassLabels: ["lower", "middle", "higher"],
} satisfies Input;
export const exampleOutput = {
  matchedTrialRelativeDryMassRatios: [2, 1],
  callerTrialVigourClassLabels: ["higher", "lower"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/rootstock-vigour-classification-lookup",
  title: "Rootstock Vigour Classification Lookup",
  description:
    "Classify actual matched rootstock trial/reference shoot dry mass ratios under caller bands; not universal vigor labels from names, cane mass/length or canopy width, scion/site confounds external.",
  inputs: inputFields,
  outputs: [
    {
      id: "matchedTrialRelativeDryMassRatios",
      label: "Matched trial relative dry mass ratios",
      kind: "numberList",
    },
    {
      id: "callerTrialVigourClassLabels",
      label: "Caller trial vigour class labels",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerRootstockTrialIds:
        value.callerRootstockTrialIds as readonly string[],
      matchedTrialShootDryMassGrams:
        value.matchedTrialShootDryMassGrams as readonly number[],
      matchedReferenceShootDryMassGrams:
        value.matchedReferenceShootDryMassGrams as readonly number[],
      callerVigourRatioUpperEdges:
        value.callerVigourRatioUpperEdges as readonly number[],
      callerVigourClassLabels:
        value.callerVigourClassLabels as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
