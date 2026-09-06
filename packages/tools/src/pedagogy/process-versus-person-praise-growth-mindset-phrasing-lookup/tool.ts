import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  binary,
  unique,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerObservedPraiseIds: readonly string[];
  readonly independentlyAnnotatedStrategyProcessFlags: readonly number[];
  readonly independentlyAnnotatedFixedPersonTraitFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly processPraiseIds: readonly string[];
  readonly personTraitReviewIds: readonly string[];
}>;
const inputFields = [
  {
    id: "callerObservedPraiseIds",
    label: "Caller observed praise ids",
    kind: "stringList",
  },
  {
    id: "independentlyAnnotatedStrategyProcessFlags",
    label: "Independently annotated strategy process flags",
    kind: "numberList",
  },
  {
    id: "independentlyAnnotatedFixedPersonTraitFlags",
    label: "Independently annotated fixed person trait flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  binary(
    input.independentlyAnnotatedStrategyProcessFlags,
    "independentlyAnnotatedStrategyProcessFlags",
  );
  binary(
    input.independentlyAnnotatedFixedPersonTraitFlags,
    "independentlyAnnotatedFixedPersonTraitFlags",
  );
  aligned(
    input.callerObservedPraiseIds,
    input.independentlyAnnotatedStrategyProcessFlags,
    "callerObservedPraiseIds",
  );
  aligned(
    input.callerObservedPraiseIds,
    input.independentlyAnnotatedFixedPersonTraitFlags,
    "callerObservedPraiseIds",
  );
  unique(input.callerObservedPraiseIds, "praise ids");
  return {
    processPraiseIds: input.callerObservedPraiseIds.filter(
      (_, i) => input.independentlyAnnotatedStrategyProcessFlags[i],
    ),
    personTraitReviewIds: input.callerObservedPraiseIds.filter(
      (_, i) => input.independentlyAnnotatedFixedPersonTraitFlags[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerObservedPraiseIds: ["a", "b"],
  independentlyAnnotatedStrategyProcessFlags: [1, 0],
  independentlyAnnotatedFixedPersonTraitFlags: [0, 1],
} satisfies Input;
export const exampleOutput = {
  processPraiseIds: ["a"],
  personTraitReviewIds: ["b"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/process-versus-person-praise-growth-mindset-phrasing-lookup",
  title: "Process Versus Person Praise Growth Mindset Phrasing Lookup",
  description:
    "Independently annotated process/person praise features may overlap, not automatic NLP psychological intent ion or causal growth mindset effect. Caller independently verifies learner/context/evidence and reference edition; not causal learning efficacy, disability eligibility or educational certification.",
  inputs: inputFields,
  outputs: [
    { id: "processPraiseIds", label: "Process praise ids", kind: "stringList" },
    {
      id: "personTraitReviewIds",
      label: "Person trait review ids",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerObservedPraiseIds:
        value.callerObservedPraiseIds as readonly string[],
      independentlyAnnotatedStrategyProcessFlags:
        value.independentlyAnnotatedStrategyProcessFlags as readonly number[],
      independentlyAnnotatedFixedPersonTraitFlags:
        value.independentlyAnnotatedFixedPersonTraitFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
