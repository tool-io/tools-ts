import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerEtymologyRelationClassIds: readonly string[];
  readonly callerEtymologyRelationRequirements: readonly (readonly number[])[];
  readonly observedEtymologyRelationEvidence: readonly number[];
  readonly knownEtymologyRelationFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerEtymologyRelationClassIds",
    label: "Caller etymology relation class ids",
    kind: "stringList",
  },
  {
    id: "callerEtymologyRelationRequirements",
    label: "Caller etymology relation requirements",
    kind: "matrix",
  },
  {
    id: "observedEtymologyRelationEvidence",
    label: "Observed etymology relation evidence",
    kind: "numberList",
  },
  {
    id: "knownEtymologyRelationFlags",
    label: "Known etymology relation flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerEtymologyRelationClassIds,
    input.callerEtymologyRelationRequirements,
    input.observedEtymologyRelationEvidence,
    input.knownEtymologyRelationFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerEtymologyRelationClassIds: ["a", "b"],
  callerEtymologyRelationRequirements: [
    [1, 0],
    [0, 1],
  ],
  observedEtymologyRelationEvidence: [1, 0],
  knownEtymologyRelationFlags: [1, 0],
} satisfies Input;
export const exampleOutput = {
  compatibleCallerClasses: ["a", "b"],
  fullyWitnessedCallerClasses: ["a"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/cognate-vs-loanword-classifier",
  title: "Cognate vs Loanword Classifier",
  description:
    "Independently documented historical inheritance vs borrowing/contact evidence for cognate/loanword relation; surface spelling is not proof. Independently declared positive requirements, overlapping/unknown classes retained. Caller establishes language, dialect, method and reference context; no automatic identity or universal language-wide claim.",
  inputs: inputFields,
  outputs: [
    {
      id: "compatibleCallerClasses",
      label: "Compatible caller classes",
      kind: "stringList",
    },
    {
      id: "fullyWitnessedCallerClasses",
      label: "Fully witnessed caller classes",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerEtymologyRelationClassIds:
        value.callerEtymologyRelationClassIds as readonly string[],
      callerEtymologyRelationRequirements:
        value.callerEtymologyRelationRequirements as readonly (readonly number[])[],
      observedEtymologyRelationEvidence:
        value.observedEtymologyRelationEvidence as readonly number[],
      knownEtymologyRelationFlags:
        value.knownEtymologyRelationFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
