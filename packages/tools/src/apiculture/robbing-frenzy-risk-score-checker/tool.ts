import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerRobbingObservationsClassIds: readonly string[];
  readonly callerRobbingObservationsRequirements: readonly (readonly number[])[];
  readonly observedRobbingObservationsEvidence: readonly number[];
  readonly knownRobbingObservationsFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerRobbingObservationsClassIds",
    label: "Caller robbing observations class ids",
    kind: "stringList",
  },
  {
    id: "callerRobbingObservationsRequirements",
    label: "Caller robbing observations requirements",
    kind: "matrix",
  },
  {
    id: "observedRobbingObservationsEvidence",
    label: "Observed robbing observations evidence",
    kind: "numberList",
  },
  {
    id: "knownRobbingObservationsFlags",
    label: "Known robbing observations flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerRobbingObservationsClassIds,
    input.callerRobbingObservationsRequirements,
    input.observedRobbingObservationsEvidence,
    input.knownRobbingObservationsFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerRobbingObservationsClassIds: ["a", "b"],
  callerRobbingObservationsRequirements: [
    [1, 0],
    [0, 1],
  ],
  observedRobbingObservationsEvidence: [1, 0],
  knownRobbingObservationsFlags: [1, 0],
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
  id: "apiculture/robbing-frenzy-risk-score-checker",
  title: "Robbing Frenzy Risk Score Checker",
  description:
    "Independently observed flight/entrance/store-contact evidence under caller robbing-monitoring criteria; not causal robbing diagnosis. Independently declared positive requirements, overlapping/unknown classes retained. Caller independently verifies strain, site, protocol and evidence; not colony-health, treatment, transport-safety or regulatory certification.",
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
      callerRobbingObservationsClassIds:
        value.callerRobbingObservationsClassIds as readonly string[],
      callerRobbingObservationsRequirements:
        value.callerRobbingObservationsRequirements as readonly (readonly number[])[],
      observedRobbingObservationsEvidence:
        value.observedRobbingObservationsEvidence as readonly number[],
      knownRobbingObservationsFlags:
        value.knownRobbingObservationsFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
