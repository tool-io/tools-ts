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
  readonly callerWindDownOrderStepIds: readonly string[];
  readonly callerWindDownOrderPrerequisiteEdges: readonly (readonly number[])[];
  readonly observedWindDownOrderCompletedFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly missingPrerequisiteStepIds: readonly string[];
}>;
const inputFields = [
  {
    id: "callerWindDownOrderStepIds",
    label: "Caller wind down order step ids",
    kind: "stringList",
  },
  {
    id: "callerWindDownOrderPrerequisiteEdges",
    label: "Caller wind down order prerequisite edges",
    kind: "matrix",
  },
  {
    id: "observedWindDownOrderCompletedFlags",
    label: "Observed wind down order completed flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  binary(
    input.observedWindDownOrderCompletedFlags,
    "observedWindDownOrderCompletedFlags",
  );
  aligned(
    input.callerWindDownOrderStepIds,
    input.observedWindDownOrderCompletedFlags,
    "callerWindDownOrderStepIds",
  );
  unique(input.callerWindDownOrderStepIds, "steps");
  acyclicEdges(
    input.callerWindDownOrderStepIds.length,
    input.callerWindDownOrderPrerequisiteEdges,
  );
  const missing = new Set<number>();
  for (const [a, b] of input.callerWindDownOrderPrerequisiteEdges) {
    bounded(a, "prerequisite", 0, input.callerWindDownOrderStepIds.length - 1);
    bounded(b, "dependent", 0, input.callerWindDownOrderStepIds.length - 1);
    if (a === b) simpleError("edge", "No self dependency.");
    if (
      input.observedWindDownOrderCompletedFlags[b] &&
      !input.observedWindDownOrderCompletedFlags[a]
    )
      missing.add(a);
  }
  return {
    missingPrerequisiteStepIds: input.callerWindDownOrderStepIds.filter(
      (_, i) => missing.has(i),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerWindDownOrderStepIds: ["a", "b", "c"],
  callerWindDownOrderPrerequisiteEdges: [
    [0, 1],
    [1, 2],
  ],
  observedWindDownOrderCompletedFlags: [1, 0, 1],
} satisfies Input;
export const exampleOutput = {
  missingPrerequisiteStepIds: ["b"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/shutdown-wind-down-order-of-operations-checklist",
  title: "Shutdown Wind Down Order of Operations Checklist",
  description:
    "Caller independently verified shutdown notices/payments/data/filings dependency order; no instructions to bypass creditors/employees. Caller independently verifies policy, evidence, dates and applicability; not legal/compliance advice or causal business-success prediction.",
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
      callerWindDownOrderStepIds:
        value.callerWindDownOrderStepIds as readonly string[],
      callerWindDownOrderPrerequisiteEdges:
        value.callerWindDownOrderPrerequisiteEdges as readonly (readonly number[])[],
      observedWindDownOrderCompletedFlags:
        value.observedWindDownOrderCompletedFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
