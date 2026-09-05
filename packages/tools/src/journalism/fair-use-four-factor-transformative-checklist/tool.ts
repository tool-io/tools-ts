import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerFairUseFactorsClassIds: readonly string[];
  readonly callerFairUseFactorsRequirements: readonly (readonly number[])[];
  readonly observedFairUseFactorsEvidence: readonly number[];
  readonly knownFairUseFactorsFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerFairUseFactorsClassIds",
    label: "Caller fair use factors class ids",
    kind: "stringList",
  },
  {
    id: "callerFairUseFactorsRequirements",
    label: "Caller fair use factors requirements",
    kind: "matrix",
  },
  {
    id: "observedFairUseFactorsEvidence",
    label: "Observed fair use factors evidence",
    kind: "numberList",
  },
  {
    id: "knownFairUseFactorsFlags",
    label: "Known fair use factors flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerFairUseFactorsClassIds,
    input.callerFairUseFactorsRequirements,
    input.observedFairUseFactorsEvidence,
    input.knownFairUseFactorsFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerFairUseFactorsClassIds: ["a", "b"],
  callerFairUseFactorsRequirements: [
    [1, 0],
    [0, 1],
  ],
  observedFairUseFactorsEvidence: [1, 0],
  knownFairUseFactorsFlags: [1, 0],
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
  id: "journalism/fair-use-four-factor-transformative-checklist",
  title: "Fair Use Four Factor Transformative Checklist",
  description:
    "Caller independently verified purpose/character, nature, amount and market-effect review evidence; factors are not a points-based fair-use determination. Independently declared positive evidence requirements; overlaps and unknowns retained. Caller independently verifies context, evidence, reference edition and applicability; not factual authenticity, current legal advice or publication clearance.",
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
      callerFairUseFactorsClassIds:
        value.callerFairUseFactorsClassIds as readonly string[],
      callerFairUseFactorsRequirements:
        value.callerFairUseFactorsRequirements as readonly (readonly number[])[],
      observedFairUseFactorsEvidence:
        value.observedFairUseFactorsEvidence as readonly number[],
      knownFairUseFactorsFlags:
        value.knownFairUseFactorsFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
