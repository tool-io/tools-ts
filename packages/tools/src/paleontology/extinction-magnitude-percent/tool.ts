import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, ids } from "../shared.js";
export type Input = Readonly<{
  readonly preEventTaxonIds: readonly number[];
  readonly postEventTaxonIds: readonly number[];
  readonly comparableDetection: boolean;
}>;
export type Output = Readonly<{
  readonly observedLostTaxaCount: number;
  readonly observedSurvivingTaxaCount: number;
  readonly observedLostPreEventTaxaPercent: number;
  readonly newlyObservedTaxaCount: number;
}>;
const inputFields = [
  { id: "preEventTaxonIds", label: "Pre event taxon ids", kind: "numberList" },
  {
    id: "postEventTaxonIds",
    label: "Post event taxon ids",
    kind: "numberList",
  },
  { id: "comparableDetection", label: "Comparable detection", kind: "boolean" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  ids(input.preEventTaxonIds, "preEventTaxonIds");
  if (input.postEventTaxonIds.length)
    ids(input.postEventTaxonIds, "postEventTaxonIds");
  if (!input.comparableDetection)
    simpleError(
      "comparableDetection",
      "Comparable sampling/detection assumption must be explicitly accepted.",
    );
  const post = new Set(input.postEventTaxonIds),
    pre = new Set(input.preEventTaxonIds),
    observedSurvivingTaxaCount = input.preEventTaxonIds.filter((v) =>
      post.has(v),
    ).length,
    observedLostTaxaCount = pre.size - observedSurvivingTaxaCount;
  return {
    observedLostTaxaCount,
    observedSurvivingTaxaCount,
    observedLostPreEventTaxaPercent: (100 * observedLostTaxaCount) / pre.size,
    newlyObservedTaxaCount: input.postEventTaxonIds.filter((v) => !pre.has(v))
      .length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  preEventTaxonIds: [1, 2, 3, 4],
  postEventTaxonIds: [2, 3, 5],
  comparableDetection: true,
} satisfies Input;
export const exampleOutput = {
  observedLostTaxaCount: 2,
  observedSurvivingTaxaCount: 2,
  observedLostPreEventTaxaPercent: 50,
  newlyObservedTaxaCount: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleontology/extinction-magnitude-percent",
  title: "Extinction Magnitude Percent Taxa",
  description:
    "Compare distinct before/after observed taxa with comparable detection, separating lost/surviving/new records; absent observations do not themselves establish biological extinction.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedLostTaxaCount",
      label: "Observed lost taxa count",
      kind: "number",
    },
    {
      id: "observedSurvivingTaxaCount",
      label: "Observed surviving taxa count",
      kind: "number",
    },
    {
      id: "observedLostPreEventTaxaPercent",
      label: "Observed lost pre event taxa percent",
      kind: "number",
    },
    {
      id: "newlyObservedTaxaCount",
      label: "Newly observed taxa count",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      preEventTaxonIds: value.preEventTaxonIds as readonly number[],
      postEventTaxonIds: value.postEventTaxonIds as readonly number[],
      comparableDetection: value.comparableDetection as boolean,
    }),
});
export const run = tool.execute;
export default tool;
