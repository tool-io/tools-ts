import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerPowerMoveReviewClassIds: readonly string[];
  readonly callerPowerMoveReviewRequirements: readonly (readonly number[])[];
  readonly observedPowerMoveReviewEvidence: readonly number[];
  readonly knownPowerMoveReviewFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerPowerMoveReviewClassIds",
    label: "Caller power move review class ids",
    kind: "stringList",
  },
  {
    id: "callerPowerMoveReviewRequirements",
    label: "Caller power move review requirements",
    kind: "matrix",
  },
  {
    id: "observedPowerMoveReviewEvidence",
    label: "Observed power move review evidence",
    kind: "numberList",
  },
  {
    id: "knownPowerMoveReviewFlags",
    label: "Known power move review flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerPowerMoveReviewClassIds,
    input.callerPowerMoveReviewRequirements,
    input.observedPowerMoveReviewEvidence,
    input.knownPowerMoveReviewFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerPowerMoveReviewClassIds: ["a", "b"],
  callerPowerMoveReviewRequirements: [
    [1, 0],
    [0, 1],
  ],
  observedPowerMoveReviewEvidence: [1, 0],
  knownPowerMoveReviewFlags: [1, 0],
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
  id: "dance/windmill-headspin-power-move-prereq-checker",
  title: "Windmill Headspin Power Move Prereq Checker",
  description:
    "Caller independently documented qualified-supervision/progression/medical review prerequisites for power-move review; not physical clearance or execution instructions for heads pins. Independently declared positive evidence requirements; overlaps and unknowns retained. Caller independently establishes score/style/protocol/reference applicability; not physical readiness, safe training or injury risk diagnosis.",
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
      callerPowerMoveReviewClassIds:
        value.callerPowerMoveReviewClassIds as readonly string[],
      callerPowerMoveReviewRequirements:
        value.callerPowerMoveReviewRequirements as readonly (readonly number[])[],
      observedPowerMoveReviewEvidence:
        value.observedPowerMoveReviewEvidence as readonly number[],
      knownPowerMoveReviewFlags:
        value.knownPowerMoveReviewFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
