import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  acyclicEdges,
  finish,
  bounded,
  aligned,
  binary,
  unique,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerSetupOrderStepIds: readonly string[];
  readonly callerSetupOrderPrerequisiteEdges: readonly (readonly number[])[];
  readonly observedSetupOrderCompletedFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly missingPrerequisiteStepIds: readonly string[];
}>;
const inputFields = [
  {
    id: "callerSetupOrderStepIds",
    label: "Caller setup order step ids",
    kind: "stringList",
  },
  {
    id: "callerSetupOrderPrerequisiteEdges",
    label: "Caller setup order prerequisite edges",
    kind: "matrix",
  },
  {
    id: "observedSetupOrderCompletedFlags",
    label: "Observed setup order completed flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  binary(
    input.observedSetupOrderCompletedFlags,
    "observedSetupOrderCompletedFlags",
  );
  aligned(
    input.callerSetupOrderStepIds,
    input.observedSetupOrderCompletedFlags,
    "callerSetupOrderStepIds",
  );
  unique(input.callerSetupOrderStepIds, "steps");
  acyclicEdges(
    input.callerSetupOrderStepIds.length,
    input.callerSetupOrderPrerequisiteEdges,
  );
  const missing = new Set<number>();
  for (const [a, b] of input.callerSetupOrderPrerequisiteEdges) {
    bounded(a, "prerequisite", 0, input.callerSetupOrderStepIds.length - 1);
    bounded(b, "dependent", 0, input.callerSetupOrderStepIds.length - 1);
    if (a === b) simpleError("edge", "No self dependency.");
    if (
      input.observedSetupOrderCompletedFlags[b] &&
      !input.observedSetupOrderCompletedFlags[a]
    )
      missing.add(a);
  }
  return {
    missingPrerequisiteStepIds: input.callerSetupOrderStepIds.filter((_, i) =>
      missing.has(i),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerSetupOrderStepIds: ["a", "b", "c"],
  callerSetupOrderPrerequisiteEdges: [
    [0, 1],
    [1, 2],
  ],
  observedSetupOrderCompletedFlags: [1, 0, 1],
} satisfies Input;
export const exampleOutput = {
  missingPrerequisiteStepIds: ["b"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/ein-dba-bank-account-setup-order-checklist",
  title: "Ein Dba Bank Account Setup Order Checklist",
  description:
    "Caller independently required EIN/DBA/bank setup dependency order, jurisdiction/entity applicability external. Caller independently verifies policy, evidence, dates and applicability; not legal/compliance advice or causal business-success prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "missingPrerequisiteStepIds",
      label: "Missing prerequisite step ids",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerSetupOrderStepIds:
        value.callerSetupOrderStepIds as readonly string[],
      callerSetupOrderPrerequisiteEdges:
        value.callerSetupOrderPrerequisiteEdges as readonly (readonly number[])[],
      observedSetupOrderCompletedFlags:
        value.observedSetupOrderCompletedFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
