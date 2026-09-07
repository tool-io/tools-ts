import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  unique,
  simpleError,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly callerObservedExamples: readonly string[];
  readonly callerProposedGeneralization: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerObservedExamples",
    label: "Caller observed examples",
    kind: "stringList",
  },
  {
    id: "callerProposedGeneralization",
    label: "Caller proposed generalization",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  unique(input.callerObservedExamples, "observedcases");
  if (!input.callerProposedGeneralization.trim())
    simpleError("claim", "Explicit proposed generalization required.");
  return {
    exampleCount: input.callerObservedExamples.length,
    proposedGeneralization: input.callerProposedGeneralization,
    unverifiedInference: true,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerObservedExamples: ["case-a", "case-b"],
    callerProposedGeneralization: "These cases exhibit the proposed pattern",
  },
  output: {
    result: {
      exampleCount: 2,
      proposedGeneralization: "These cases exhibit the proposed pattern",
      unverifiedInference: true,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "rhetoric/paradeigma-example-inductive-builder",
  title: "Paradeigma Example Inductive Builder",
  description:
    "Build an explicitly qualified example-to-generalization outline from independently supplied distinct cases; no statistical representativeness or deductive proof.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
