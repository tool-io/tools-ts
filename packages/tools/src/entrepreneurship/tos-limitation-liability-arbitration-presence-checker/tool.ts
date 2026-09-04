import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerTosClausesClassIds: readonly string[];
  readonly callerTosClausesRequirements: readonly (readonly number[])[];
  readonly observedTosClausesEvidence: readonly number[];
  readonly knownTosClausesFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerTosClausesClassIds",
    label: "Caller tos clauses class ids",
    kind: "stringList",
  },
  {
    id: "callerTosClausesRequirements",
    label: "Caller tos clauses requirements",
    kind: "matrix",
  },
  {
    id: "observedTosClausesEvidence",
    label: "Observed tos clauses evidence",
    kind: "numberList",
  },
  {
    id: "knownTosClausesFlags",
    label: "Known tos clauses flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerTosClausesClassIds,
    input.callerTosClausesRequirements,
    input.observedTosClausesEvidence,
    input.knownTosClausesFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerTosClausesClassIds: ["a", "b"],
  callerTosClausesRequirements: [
    [1, 0],
    [0, 1],
  ],
  observedTosClausesEvidence: [1, 0],
  knownTosClausesFlags: [1, 0],
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
  id: "entrepreneurship/tos-limitation-liability-arbitration-presence-checker",
  title: "TOS Limitation Liability Arbitration Presence Checker",
  description:
    "Caller independently verified scope/version applicable liability/arbitration terms evidence, clause presence not enforceability. Independently declared positive requirements, overlapping/unknown classes retained. Caller independently verifies policy, evidence, dates and applicability; not legal/compliance advice or causal business-success prediction.",
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
      callerTosClausesClassIds:
        value.callerTosClausesClassIds as readonly string[],
      callerTosClausesRequirements:
        value.callerTosClausesRequirements as readonly (readonly number[])[],
      observedTosClausesEvidence:
        value.observedTosClausesEvidence as readonly number[],
      knownTosClausesFlags: value.knownTosClausesFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
