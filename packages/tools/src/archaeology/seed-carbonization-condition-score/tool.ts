import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerSeedCarbonizationClassIds: readonly string[];
  readonly callerSeedCarbonizationRequirements: readonly (readonly number[])[];
  readonly observedSeedCarbonizationEvidence: readonly number[];
  readonly knownSeedCarbonizationFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerSeedCarbonizationClassIds",
    label: "Caller seed carbonization class ids",
    kind: "stringList",
  },
  {
    id: "callerSeedCarbonizationRequirements",
    label: "Caller seed carbonization requirements",
    kind: "matrix",
  },
  {
    id: "observedSeedCarbonizationEvidence",
    label: "Observed seed carbonization evidence",
    kind: "numberList",
  },
  {
    id: "knownSeedCarbonizationFlags",
    label: "Known seed carbonization flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerSeedCarbonizationClassIds,
    input.callerSeedCarbonizationRequirements,
    input.observedSeedCarbonizationEvidence,
    input.knownSeedCarbonizationFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerSeedCarbonizationClassIds: ["a", "b"],
  callerSeedCarbonizationRequirements: [
    [1, 0],
    [0, 1],
  ],
  observedSeedCarbonizationEvidence: [1, 0],
  knownSeedCarbonizationFlags: [1, 0],
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
  id: "archaeology/seed-carbonization-condition-score",
  title: "Seed Carbonization Condition Score",
  description:
    "Compare independently observed seed-preservation features with caller condition requirements. Retains compatible classes and missing evidence; does not determine carbonization temperature, dating integrity or taxonomy.",
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
      callerSeedCarbonizationClassIds:
        value.callerSeedCarbonizationClassIds as readonly string[],
      callerSeedCarbonizationRequirements:
        value.callerSeedCarbonizationRequirements as readonly (readonly number[])[],
      observedSeedCarbonizationEvidence:
        value.observedSeedCarbonizationEvidence as readonly number[],
      knownSeedCarbonizationFlags:
        value.knownSeedCarbonizationFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
