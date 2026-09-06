import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, aligned, unique } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerAbstractConceptIds: readonly string[];
  readonly callerConcreteExampleConceptIds: readonly string[];
  readonly callerDistinctExampleContexts: readonly string[];
}>;
export type Output = Readonly<{
  readonly conceptsWithoutConcreteExamples: readonly string[];
  readonly distinctExampleContextCounts: readonly number[];
}>;
const inputFields = [
  {
    id: "callerAbstractConceptIds",
    label: "Caller abstract concept ids",
    kind: "stringList",
  },
  {
    id: "callerConcreteExampleConceptIds",
    label: "Caller concrete example concept ids",
    kind: "stringList",
  },
  {
    id: "callerDistinctExampleContexts",
    label: "Caller distinct example contexts",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerConcreteExampleConceptIds,
    input.callerDistinctExampleContexts,
    "callerConcreteExampleConceptIds",
  );
  unique(input.callerAbstractConceptIds, "concepts");
  if (
    input.callerConcreteExampleConceptIds.some(
      (v) => !input.callerAbstractConceptIds.includes(v),
    )
  )
    simpleError("concept", "Examples must reference a declaredconcept.");
  return {
    conceptsWithoutConcreteExamples: input.callerAbstractConceptIds.filter(
      (v) => !input.callerConcreteExampleConceptIds.includes(v),
    ),
    distinctExampleContextCounts: input.callerAbstractConceptIds.map(
      (id) =>
        new Set(
          input.callerDistinctExampleContexts.filter(
            (_, i) => input.callerConcreteExampleConceptIds[i] === id,
          ),
        ).size,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerAbstractConceptIds: ["a", "b"],
  callerConcreteExampleConceptIds: ["a", "a"],
  callerDistinctExampleContexts: ["one", "two"],
} satisfies Input;
export const exampleOutput = {
  conceptsWithoutConcreteExamples: ["b"],
  distinctExampleContextCounts: [2, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/concrete-examples-abstract-concept-pairing-guide",
  title: "Concrete Examples Abstract Concept Pairing Guide",
  description:
    "Audit independently annotated concrete example/abstract concept pai rings and distinct context coverage, not dual verbal/visual pairing already implemented. Caller independently verifies learner/context/evidence and reference edition; not causal learning efficacy, disability eligibility or educational certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "conceptsWithoutConcreteExamples",
      label: "Concepts without concrete examples",
      kind: "stringList",
    },
    {
      id: "distinctExampleContextCounts",
      label: "Distinct example context counts",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerAbstractConceptIds:
        value.callerAbstractConceptIds as readonly string[],
      callerConcreteExampleConceptIds:
        value.callerConcreteExampleConceptIds as readonly string[],
      callerDistinctExampleContexts:
        value.callerDistinctExampleContexts as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
