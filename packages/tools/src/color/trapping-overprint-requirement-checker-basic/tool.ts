import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerTrapOverprintClassIds: readonly string[];
  readonly callerTrapOverprintRequirements: readonly (readonly number[])[];
  readonly observedTrapOverprintEvidence: readonly number[];
  readonly knownTrapOverprintFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerTrapOverprintClassIds",
    label: "Caller trap overprint class ids",
    kind: "stringList",
  },
  {
    id: "callerTrapOverprintRequirements",
    label: "Caller trap overprint requirements",
    kind: "matrix",
  },
  {
    id: "observedTrapOverprintEvidence",
    label: "Observed trap overprint evidence",
    kind: "numberList",
  },
  {
    id: "knownTrapOverprintFlags",
    label: "Known trap overprint flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerTrapOverprintClassIds,
    input.callerTrapOverprintRequirements,
    input.observedTrapOverprintEvidence,
    input.knownTrapOverprintFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerTrapOverprintClassIds: ["a", "b"],
  callerTrapOverprintRequirements: [
    [1, 0],
    [0, 1],
  ],
  observedTrapOverprintEvidence: [1, 0],
  knownTrapOverprintFlags: [1, 0],
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
  id: "color/trapping-overprint-requirement-checker-basic",
  title: "Trapping Overprint Requirement Basic Check",
  description:
    "Independently observed registration/knockout/ink/substrate job facts against caller pre press review requirements; not infer trap width or safe overprint from hue. Independently declared positive evidence requirements; overlaps and unknowns retained. Explicit declared color space/reference and caller applicability; not spectral equivalence, pigment mixing, press readiness or accessibility certification.",
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
      callerTrapOverprintClassIds:
        value.callerTrapOverprintClassIds as readonly string[],
      callerTrapOverprintRequirements:
        value.callerTrapOverprintRequirements as readonly (readonly number[])[],
      observedTrapOverprintEvidence:
        value.observedTrapOverprintEvidence as readonly number[],
      knownTrapOverprintFlags:
        value.knownTrapOverprintFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
