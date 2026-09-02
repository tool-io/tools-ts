import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerUseWearPolishClassIds: readonly string[];
  readonly callerUseWearPolishRequirements: readonly (readonly number[])[];
  readonly observedUseWearPolishEvidence: readonly number[];
  readonly knownUseWearPolishFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerUseWearPolishClassIds",
    label: "Caller use wear polish class ids",
    kind: "stringList",
  },
  {
    id: "callerUseWearPolishRequirements",
    label: "Caller use wear polish requirements",
    kind: "matrix",
  },
  {
    id: "observedUseWearPolishEvidence",
    label: "Observed use wear polish evidence",
    kind: "numberList",
  },
  {
    id: "knownUseWearPolishFlags",
    label: "Known use wear polish flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerUseWearPolishClassIds,
    input.callerUseWearPolishRequirements,
    input.observedUseWearPolishEvidence,
    input.knownUseWearPolishFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerUseWearPolishClassIds: ["a", "b"],
  callerUseWearPolishRequirements: [
    [1, 0],
    [0, 1],
  ],
  observedUseWearPolishEvidence: [1, 0],
  knownUseWearPolishFlags: [1, 0],
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
  id: "archaeology/use-wear-polish-classify",
  title: "Use-Wear Polish Classifier",
  description:
    "Compare independently observed polish and microtopography with caller experimental reference criteria. Overlaps and unknown evidence remain explicit; this does not identify tool function or provenance.",
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
      callerUseWearPolishClassIds:
        value.callerUseWearPolishClassIds as readonly string[],
      callerUseWearPolishRequirements:
        value.callerUseWearPolishRequirements as readonly (readonly number[])[],
      observedUseWearPolishEvidence:
        value.observedUseWearPolishEvidence as readonly number[],
      knownUseWearPolishFlags:
        value.knownUseWearPolishFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
