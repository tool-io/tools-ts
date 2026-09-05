import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerContactVarietyClassIds: readonly string[];
  readonly callerContactVarietyRequirements: readonly (readonly number[])[];
  readonly observedContactVarietyEvidence: readonly number[];
  readonly knownContactVarietyFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerContactVarietyClassIds",
    label: "Caller contact variety class ids",
    kind: "stringList",
  },
  {
    id: "callerContactVarietyRequirements",
    label: "Caller contact variety requirements",
    kind: "matrix",
  },
  {
    id: "observedContactVarietyEvidence",
    label: "Observed contact variety evidence",
    kind: "numberList",
  },
  {
    id: "knownContactVarietyFlags",
    label: "Known contact variety flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerContactVarietyClassIds,
    input.callerContactVarietyRequirements,
    input.observedContactVarietyEvidence,
    input.knownContactVarietyFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerContactVarietyClassIds: ["a", "b"],
  callerContactVarietyRequirements: [
    [1, 0],
    [0, 1],
  ],
  observedContactVarietyEvidence: [1, 0],
  knownContactVarietyFlags: [1, 0],
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
  id: "linguistics/pidgin-vs-creole-classifier",
  title: "Pidgin vs Creole Classifier",
  description:
    "Caller independently documented transmission/community/functional-domain evidence for pidgin/creole candidate criteria, not a social label inferred from simplicity. Independently declared positive requirements, overlapping/unknown classes retained. Caller establishes language, dialect, method and reference context; no automatic identity or universal language-wide claim.",
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
      callerContactVarietyClassIds:
        value.callerContactVarietyClassIds as readonly string[],
      callerContactVarietyRequirements:
        value.callerContactVarietyRequirements as readonly (readonly number[])[],
      observedContactVarietyEvidence:
        value.observedContactVarietyEvidence as readonly number[],
      knownContactVarietyFlags:
        value.knownContactVarietyFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
