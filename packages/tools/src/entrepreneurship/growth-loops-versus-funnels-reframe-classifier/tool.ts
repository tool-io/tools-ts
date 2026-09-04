import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerGrowthLoopClassIds: readonly string[];
  readonly callerGrowthLoopRequirements: readonly (readonly number[])[];
  readonly observedGrowthLoopEvidence: readonly number[];
  readonly knownGrowthLoopFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerGrowthLoopClassIds",
    label: "Caller growth loop class ids",
    kind: "stringList",
  },
  {
    id: "callerGrowthLoopRequirements",
    label: "Caller growth loop requirements",
    kind: "matrix",
  },
  {
    id: "observedGrowthLoopEvidence",
    label: "Observed growth loop evidence",
    kind: "numberList",
  },
  {
    id: "knownGrowthLoopFlags",
    label: "Known growth loop flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerGrowthLoopClassIds,
    input.callerGrowthLoopRequirements,
    input.observedGrowthLoopEvidence,
    input.knownGrowthLoopFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerGrowthLoopClassIds: ["a", "b"],
  callerGrowthLoopRequirements: [
    [1, 0],
    [0, 1],
  ],
  observedGrowthLoopEvidence: [1, 0],
  knownGrowthLoopFlags: [1, 0],
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
  id: "entrepreneurship/growth-loops-versus-funnels-reframe-classifier",
  title: "Growth Loops Versus Funnels Reframe Classifier",
  description:
    "Actual reinvestment/return-path evidence vs caller loop/funnel definitions, no loop inferred from conversion rate. Independently declared positive requirements, overlapping/unknown classes retained. Caller independently verifies policy, evidence, dates and applicability; not legal/compliance advice or causal business-success prediction.",
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
      callerGrowthLoopClassIds:
        value.callerGrowthLoopClassIds as readonly string[],
      callerGrowthLoopRequirements:
        value.callerGrowthLoopRequirements as readonly (readonly number[])[],
      observedGrowthLoopEvidence:
        value.observedGrowthLoopEvidence as readonly number[],
      knownGrowthLoopFlags: value.knownGrowthLoopFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
