import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, observedBands } from "../batch42-shared.js";
export type Input = Readonly<{
  readonly observedSeamEvidence: readonly number[];
  readonly callerSeamEvidenceLower: readonly number[];
  readonly callerSeamEvidenceUpper: readonly number[];
  readonly knownSeamEvidenceFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedKnownMargins: readonly number[];
  readonly knownReviewIndices: readonly number[];
  readonly unknownIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedSeamEvidence",
    label: "Observed seam evidence",
    kind: "numberList",
  },
  {
    id: "callerSeamEvidenceLower",
    label: "Caller seam evidence lower",
    kind: "numberList",
  },
  {
    id: "callerSeamEvidenceUpper",
    label: "Caller seam evidence upper",
    kind: "numberList",
  },
  {
    id: "knownSeamEvidenceFlags",
    label: "Known seam evidence flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return observedBands(
    input.observedSeamEvidence,
    input.callerSeamEvidenceLower,
    input.callerSeamEvidenceUpper,
    input.knownSeamEvidenceFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSeamEvidence: [2, 5],
  callerSeamEvidenceLower: [1, 1],
  callerSeamEvidenceUpper: [3, 4],
  knownSeamEvidenceFlags: [1, 0],
} satisfies Input;
export const exampleOutput = {
  signedKnownMargins: [1, 0],
  knownReviewIndices: [],
  unknownIndices: [1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "philately/coil-join-seam-flag-checker",
  title: "Coil Join Seam Detection Flag Checker",
  description:
    "Audit independently observed coil-join seam evidence against reference tolerances. Missing observations remain explicit. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedKnownMargins",
      label: "Signed known margins",
      kind: "numberList",
    },
    {
      id: "knownReviewIndices",
      label: "Known review indices",
      kind: "numberList",
    },
    { id: "unknownIndices", label: "Unknown indices", kind: "numberList" },
  ],
  calculate: (value) =>
    calculate({
      observedSeamEvidence: value.observedSeamEvidence as readonly number[],
      callerSeamEvidenceLower:
        value.callerSeamEvidenceLower as readonly number[],
      callerSeamEvidenceUpper:
        value.callerSeamEvidenceUpper as readonly number[],
      knownSeamEvidenceFlags: value.knownSeamEvidenceFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
