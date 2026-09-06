import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch42-shared.js";
export type Input = Readonly<{
  readonly callerRouletteCutsClassIds: readonly string[];
  readonly callerRouletteCutsRequirements: readonly (readonly number[])[];
  readonly observedRouletteCutsEvidence: readonly number[];
  readonly knownRouletteCutsFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerRouletteCutsClassIds",
    label: "Caller roulette cuts class ids",
    kind: "stringList",
  },
  {
    id: "callerRouletteCutsRequirements",
    label: "Caller roulette cuts requirements",
    kind: "matrix",
  },
  {
    id: "observedRouletteCutsEvidence",
    label: "Observed roulette cuts evidence",
    kind: "numberList",
  },
  {
    id: "knownRouletteCutsFlags",
    label: "Known roulette cuts flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerRouletteCutsClassIds,
    input.callerRouletteCutsRequirements,
    input.observedRouletteCutsEvidence,
    input.knownRouletteCutsFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerRouletteCutsClassIds: ["a", "b"],
  callerRouletteCutsRequirements: [
    [1, 0],
    [0, 1],
  ],
  observedRouletteCutsEvidence: [1, 0],
  knownRouletteCutsFlags: [1, 0],
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
  id: "philately/roulette-separation-identifier",
  title: "Roulette Separation Identifier (no holes)",
  description:
    "Compare already observed cut rather than hole morphology against independently established separation evidence. Independently established positive evidence requirements; overlapping compatible classes and unknowns retained. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
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
      callerRouletteCutsClassIds:
        value.callerRouletteCutsClassIds as readonly string[],
      callerRouletteCutsRequirements:
        value.callerRouletteCutsRequirements as readonly (readonly number[])[],
      observedRouletteCutsEvidence:
        value.observedRouletteCutsEvidence as readonly number[],
      knownRouletteCutsFlags: value.knownRouletteCutsFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
