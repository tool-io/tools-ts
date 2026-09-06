import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, observedBands } from "../batch42-shared.js";
export type Input = Readonly<{
  readonly observedExistingPaperTestResponse: readonly number[];
  readonly callerExistingPaperTestResponseLower: readonly number[];
  readonly callerExistingPaperTestResponseUpper: readonly number[];
  readonly knownExistingPaperTestResponseFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedKnownMargins: readonly number[];
  readonly knownReviewIndices: readonly number[];
  readonly unknownIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedExistingPaperTestResponse",
    label: "Observed existing paper test response",
    kind: "numberList",
  },
  {
    id: "callerExistingPaperTestResponseLower",
    label: "Caller existing paper test response lower",
    kind: "numberList",
  },
  {
    id: "callerExistingPaperTestResponseUpper",
    label: "Caller existing paper test response upper",
    kind: "numberList",
  },
  {
    id: "knownExistingPaperTestResponseFlags",
    label: "Known existing paper test response flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return observedBands(
    input.observedExistingPaperTestResponse,
    input.callerExistingPaperTestResponseLower,
    input.callerExistingPaperTestResponseUpper,
    input.knownExistingPaperTestResponseFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedExistingPaperTestResponse: [2, 5],
  callerExistingPaperTestResponseLower: [1, 1],
  callerExistingPaperTestResponseUpper: [3, 4],
  knownExistingPaperTestResponseFlags: [1, 0],
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
  id: "philately/chalky-paper-test-flag",
  title: "Chalky Paper Vinegar Test Sensitivity Flag",
  description:
    "Audit independently supplied prior paper-test evidence, not vinegar handling advice or authentication. Missing observations remain explicit. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
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
      observedExistingPaperTestResponse:
        value.observedExistingPaperTestResponse as readonly number[],
      callerExistingPaperTestResponseLower:
        value.callerExistingPaperTestResponseLower as readonly number[],
      callerExistingPaperTestResponseUpper:
        value.callerExistingPaperTestResponseUpper as readonly number[],
      knownExistingPaperTestResponseFlags:
        value.knownExistingPaperTestResponseFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
