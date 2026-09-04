import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  binary,
  sum,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedDotGapFlags: readonly number[];
  readonly observedDotRepresentedAreaWeights: readonly number[];
  readonly knownDotAssessmentFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly knownDotGapFraction: number;
  readonly wholeGridGapLowerBound: number;
  readonly wholeGridGapUpperBound: number;
}>;
const inputFields = [
  {
    id: "observedDotGapFlags",
    label: "Observed dot gap flags",
    kind: "numberList",
  },
  {
    id: "observedDotRepresentedAreaWeights",
    label: "Observed dot represented area weights",
    kind: "numberList",
  },
  {
    id: "knownDotAssessmentFlags",
    label: "Known dot assessment flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedDotRepresentedAreaWeights.forEach((v) =>
    nonnegative(v, "observedDotRepresentedAreaWeights"),
  );
  binary(input.observedDotGapFlags, "observedDotGapFlags");
  binary(input.knownDotAssessmentFlags, "knownDotAssessmentFlags");
  aligned(
    input.observedDotGapFlags,
    input.observedDotRepresentedAreaWeights,
    "observedDotGapFlags",
  );
  aligned(
    input.observedDotGapFlags,
    input.knownDotAssessmentFlags,
    "observedDotGapFlags",
  );
  const total = sum(input.observedDotRepresentedAreaWeights),
    known = sum(
      input.observedDotRepresentedAreaWeights.filter(
        (_, i) => input.knownDotAssessmentFlags[i],
      ),
    ),
    gaps = sum(
      input.observedDotRepresentedAreaWeights.filter(
        (_, i) =>
          input.knownDotAssessmentFlags[i] && input.observedDotGapFlags[i],
      ),
    );
  positive(total, "total");
  positive(known, "known");
  return {
    knownDotGapFraction: gaps / known,
    wholeGridGapLowerBound: gaps / total,
    wholeGridGapUpperBound: (gaps + total - known) / total,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDotGapFlags: [1, 0, 1],
  observedDotRepresentedAreaWeights: [1, 2, 1],
  knownDotAssessmentFlags: [1, 1, 0],
} satisfies Input;
export const exampleOutput = {
  knownDotGapFraction: 0.3333333333333333,
  wholeGridGapLowerBound: 0.25,
  wholeGridGapUpperBound: 0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/canopy-gap-area-fraction-aerial-photo-dot-grid",
  title: "Canopy Gap Fraction Dot-Grid Aerial Photo Tool",
  description:
    "Audit aerial photo dot-grid gap observations with unassessed whole-grid bounds, unlike supplied canopy-covered ground area or hemispherical crown solid angle. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "knownDotGapFraction",
      label: "Known dot gap fraction",
      kind: "number",
    },
    {
      id: "wholeGridGapLowerBound",
      label: "Whole grid gap lower bound",
      kind: "number",
    },
    {
      id: "wholeGridGapUpperBound",
      label: "Whole grid gap upper bound",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDotGapFlags: value.observedDotGapFlags as readonly number[],
      observedDotRepresentedAreaWeights:
        value.observedDotRepresentedAreaWeights as readonly number[],
      knownDotAssessmentFlags:
        value.knownDotAssessmentFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
