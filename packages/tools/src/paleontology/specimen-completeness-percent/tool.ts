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
} from "../shared.js";
export type Input = Readonly<{
  readonly expectedElementCounts: readonly number[];
  readonly observedElementCounts: readonly number[];
  readonly preservedFractionsOfObservedElements: readonly number[];
}>;
export type Output = Readonly<{
  readonly rawExpectedElementCompletenessPercent: number;
  readonly preservedElementEquivalentCompletenessPercent: number;
}>;
const inputFields = [
  {
    id: "expectedElementCounts",
    label: "Expected element counts",
    kind: "numberList",
  },
  {
    id: "observedElementCounts",
    label: "Observed element counts",
    kind: "numberList",
  },
  {
    id: "preservedFractionsOfObservedElements",
    label: "Preserved fractions of observed elements",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.expectedElementCounts.forEach((v) =>
    positive(v, "expectedElementCounts"),
  );
  input.preservedFractionsOfObservedElements.forEach((v) =>
    fraction(v, "preservedFractionsOfObservedElements"),
  );
  input.expectedElementCounts.forEach((v) => count(v, "expectedElementCounts"));
  input.observedElementCounts.forEach((v) => count(v, "observedElementCounts"));
  aligned(
    input.expectedElementCounts,
    input.observedElementCounts,
    "expectedElementCounts",
  );
  aligned(
    input.expectedElementCounts,
    input.preservedFractionsOfObservedElements,
    "expectedElementCounts",
  );
  if (
    input.observedElementCounts.some(
      (v, i) => v > input.expectedElementCounts[i],
    )
  )
    simpleError(
      "observedElementCounts",
      "Observed nonduplicated elements cannot exceed declared expected inventory.",
    );
  const total = input.expectedElementCounts.reduce((a, b) => a + b, 0);
  return {
    rawExpectedElementCompletenessPercent:
      (100 * input.observedElementCounts.reduce((a, b) => a + b, 0)) / total,
    preservedElementEquivalentCompletenessPercent:
      (100 *
        input.observedElementCounts.reduce(
          (s, v, i) => s + v * input.preservedFractionsOfObservedElements[i],
          0,
        )) /
      total,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  expectedElementCounts: [2, 4, 1],
  observedElementCounts: [1, 4, 0],
  preservedFractionsOfObservedElements: [1, 0.5, 0],
} satisfies Input;
export const exampleOutput = {
  rawExpectedElementCompletenessPercent: 71.42857142857143,
  preservedElementEquivalentCompletenessPercent: 42.857142857142854,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleontology/specimen-completeness-percent",
  title: "Specimen Completeness Percentage",
  description:
    "Distinguish observed anatomical inventory coverage from preservation-weighted element equivalents on caller expectations; neither index certifies taxonomic identification or skeleton completeness.",
  inputs: inputFields,
  outputs: [
    {
      id: "rawExpectedElementCompletenessPercent",
      label: "Raw expected element completeness percent",
      kind: "number",
    },
    {
      id: "preservedElementEquivalentCompletenessPercent",
      label: "Preserved element equivalent completeness percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      expectedElementCounts: value.expectedElementCounts as readonly number[],
      observedElementCounts: value.observedElementCounts as readonly number[],
      preservedFractionsOfObservedElements:
        value.preservedFractionsOfObservedElements as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
