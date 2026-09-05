import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerPublicityUseClassIds: readonly string[];
  readonly callerPublicityUseRequirements: readonly (readonly number[])[];
  readonly observedPublicityUseEvidence: readonly number[];
  readonly knownPublicityUseFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerPublicityUseClassIds",
    label: "Caller publicity use class ids",
    kind: "stringList",
  },
  {
    id: "callerPublicityUseRequirements",
    label: "Caller publicity use requirements",
    kind: "matrix",
  },
  {
    id: "observedPublicityUseEvidence",
    label: "Observed publicity use evidence",
    kind: "numberList",
  },
  {
    id: "knownPublicityUseFlags",
    label: "Known publicity use flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerPublicityUseClassIds,
    input.callerPublicityUseRequirements,
    input.observedPublicityUseEvidence,
    input.knownPublicityUseFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerPublicityUseClassIds: ["a", "b"],
  callerPublicityUseRequirements: [
    [1, 0],
    [0, 1],
  ],
  observedPublicityUseEvidence: [1, 0],
  knownPublicityUseFlags: [1, 0],
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
  id: "journalism/right-of-publicity-name-likeness-commercial-checker",
  title: "Right of Publicity Name Likeness Commercial Checker",
  description:
    "Caller independently verified person/likeness/commercial-use/consent facts against applicable right-of-publicity review criteria; no infer person identity or legal liability. Independently declared positive evidence requirements; overlaps and unknowns retained. Caller independently verifies context, evidence, reference edition and applicability; not factual authenticity, current legal advice or publication clearance.",
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
      callerPublicityUseClassIds:
        value.callerPublicityUseClassIds as readonly string[],
      callerPublicityUseRequirements:
        value.callerPublicityUseRequirements as readonly (readonly number[])[],
      observedPublicityUseEvidence:
        value.observedPublicityUseEvidence as readonly number[],
      knownPublicityUseFlags: value.knownPublicityUseFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
