import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly callerOmegaBlockingClassIds: readonly string[];
  readonly callerOmegaBlockingRequiredEvidence: readonly (readonly number[])[];
  readonly observedOmegaBlockingEvidence: readonly number[];
  readonly knownOmegaBlockingEvidenceFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerOmegaBlockingClassIds",
    label: "Caller omega blocking class ids",
    kind: "stringList",
  },
  {
    id: "callerOmegaBlockingRequiredEvidence",
    label: "Caller omega blocking required evidence",
    kind: "matrix",
  },
  {
    id: "observedOmegaBlockingEvidence",
    label: "Observed omega blocking evidence",
    kind: "numberList",
  },
  {
    id: "knownOmegaBlockingEvidenceFlags",
    label: "Known omega blocking evidence flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerOmegaBlockingClassIds,
    input.callerOmegaBlockingRequiredEvidence,
    input.observedOmegaBlockingEvidence,
    input.knownOmegaBlockingEvidenceFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerOmegaBlockingClassIds: ["a", "b"],
  callerOmegaBlockingRequiredEvidence: [
    [1, 0],
    [0, 1],
  ],
  observedOmegaBlockingEvidence: [1, 0],
  knownOmegaBlockingEvidenceFlags: [1, 0],
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
  id: "meteorology/blocking-high-omega-block-classifier",
  title: "Blocking High Omega Block Classifier",
  description:
    "Observed geopotential contour geometry and persistent flow evidence for caller omega-block classes, no identification from single pressure. Independently declared positive evidence requirements; overlapping/unknown classes retained. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      callerOmegaBlockingClassIds:
        value.callerOmegaBlockingClassIds as readonly string[],
      callerOmegaBlockingRequiredEvidence:
        value.callerOmegaBlockingRequiredEvidence as readonly (readonly number[])[],
      observedOmegaBlockingEvidence:
        value.observedOmegaBlockingEvidence as readonly number[],
      knownOmegaBlockingEvidenceFlags:
        value.knownOmegaBlockingEvidenceFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
