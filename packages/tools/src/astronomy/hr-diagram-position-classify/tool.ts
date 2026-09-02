import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerHrRegionClassIds: readonly string[];
  readonly callerHrRegionRequirements: readonly (readonly number[])[];
  readonly observedHrRegionEvidence: readonly number[];
  readonly knownHrRegionFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerHrRegionClassIds",
    label: "Caller hr region class ids",
    kind: "stringList",
  },
  {
    id: "callerHrRegionRequirements",
    label: "Caller hr region requirements",
    kind: "matrix",
  },
  {
    id: "observedHrRegionEvidence",
    label: "Observed hr region evidence",
    kind: "numberList",
  },
  {
    id: "knownHrRegionFlags",
    label: "Known hr region flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerHrRegionClassIds,
    input.callerHrRegionRequirements,
    input.observedHrRegionEvidence,
    input.knownHrRegionFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerHrRegionClassIds: ["a", "b"],
  callerHrRegionRequirements: [
    [1, 0],
    [0, 1],
  ],
  observedHrRegionEvidence: [1, 0],
  knownHrRegionFlags: [1, 0],
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
  id: "astronomy/hr-diagram-position-classify",
  title: "HR Diagram Position Classifier",
  description:
    "Independently verified HR diagram luminosity/temperature-region criteria with overlapping classifications retained; not actual evolutionary state from location alone. Independently declared positive evidence requirements; overlaps and unknowns retained. Model only, not an ephemeris, measured stellar identity or observational guarantee.",
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
      callerHrRegionClassIds: value.callerHrRegionClassIds as readonly string[],
      callerHrRegionRequirements:
        value.callerHrRegionRequirements as readonly (readonly number[])[],
      observedHrRegionEvidence:
        value.observedHrRegionEvidence as readonly number[],
      knownHrRegionFlags: value.knownHrRegionFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
