import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerCharcoalRingPorosityClassIds: readonly string[];
  readonly callerCharcoalRingPorosityRequirements: readonly (readonly number[])[];
  readonly observedCharcoalRingPorosityEvidence: readonly number[];
  readonly knownCharcoalRingPorosityFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerCharcoalRingPorosityClassIds",
    label: "Caller charcoal ring porosity class ids",
    kind: "stringList",
  },
  {
    id: "callerCharcoalRingPorosityRequirements",
    label: "Caller charcoal ring porosity requirements",
    kind: "matrix",
  },
  {
    id: "observedCharcoalRingPorosityEvidence",
    label: "Observed charcoal ring porosity evidence",
    kind: "numberList",
  },
  {
    id: "knownCharcoalRingPorosityFlags",
    label: "Known charcoal ring porosity flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerCharcoalRingPorosityClassIds,
    input.callerCharcoalRingPorosityRequirements,
    input.observedCharcoalRingPorosityEvidence,
    input.knownCharcoalRingPorosityFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerCharcoalRingPorosityClassIds: ["a", "b"],
  callerCharcoalRingPorosityRequirements: [
    [1, 0],
    [0, 1],
  ],
  observedCharcoalRingPorosityEvidence: [1, 0],
  knownCharcoalRingPorosityFlags: [1, 0],
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
  id: "archaeology/charcoal-id-ring-porosity-classify",
  title: "Charcoal Ring Porosity Classifier",
  description:
    "Compare independently documented charcoal ring and vessel patterns with caller reference-class criteria, retaining overlap and unknown evidence. This does not identify a tree from a pore or establish provenance.",
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
      callerCharcoalRingPorosityClassIds:
        value.callerCharcoalRingPorosityClassIds as readonly string[],
      callerCharcoalRingPorosityRequirements:
        value.callerCharcoalRingPorosityRequirements as readonly (readonly number[])[],
      observedCharcoalRingPorosityEvidence:
        value.observedCharcoalRingPorosityEvidence as readonly number[],
      knownCharcoalRingPorosityFlags:
        value.knownCharcoalRingPorosityFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
