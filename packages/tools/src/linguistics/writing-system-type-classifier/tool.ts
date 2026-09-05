import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerWritingSystemClassIds: readonly string[];
  readonly callerWritingSystemRequirements: readonly (readonly number[])[];
  readonly observedWritingSystemEvidence: readonly number[];
  readonly knownWritingSystemFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerWritingSystemClassIds",
    label: "Caller writing system class ids",
    kind: "stringList",
  },
  {
    id: "callerWritingSystemRequirements",
    label: "Caller writing system requirements",
    kind: "matrix",
  },
  {
    id: "observedWritingSystemEvidence",
    label: "Observed writing system evidence",
    kind: "numberList",
  },
  {
    id: "knownWritingSystemFlags",
    label: "Known writing system flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerWritingSystemClassIds,
    input.callerWritingSystemRequirements,
    input.observedWritingSystemEvidence,
    input.knownWritingSystemFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerWritingSystemClassIds: ["a", "b"],
  callerWritingSystemRequirements: [
    [1, 0],
    [0, 1],
  ],
  observedWritingSystemEvidence: [1, 0],
  knownWritingSystemFlags: [1, 0],
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
  id: "linguistics/writing-system-type-classifier",
  title: "Writing System Type Classifier (Alphabet/Abjad/Abugida/Logographic)",
  description:
    "Classify independently documented segment/word/sign mapping and vowel representation evidence against caller script-type criteria, retaining mixed systems; not identity from Unicode block. Independently declared positive requirements, overlapping/unknown classes retained. Caller establishes language, dialect, method and reference context; no automatic identity or universal language-wide claim.",
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
      callerWritingSystemClassIds:
        value.callerWritingSystemClassIds as readonly string[],
      callerWritingSystemRequirements:
        value.callerWritingSystemRequirements as readonly (readonly number[])[],
      observedWritingSystemEvidence:
        value.observedWritingSystemEvidence as readonly number[],
      knownWritingSystemFlags:
        value.knownWritingSystemFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
