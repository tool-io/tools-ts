import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch43-shared.js";

export type Input = Readonly<{
  readonly statedReason: string;
  readonly declaredClaim: string;
  readonly callerProposedWarrant: string;
  readonly warrantExplicitlyStated: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "statedReason", label: "Stated reason", kind: "string" },
  { id: "declaredClaim", label: "Declared claim", kind: "string" },
  {
    id: "callerProposedWarrant",
    label: "Caller proposed warrant",
    kind: "string",
  },
  {
    id: "warrantExplicitlyStated",
    label: "Warrant explicitly stated",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (
    [input.statedReason, input.declaredClaim, input.callerProposedWarrant].some(
      (v) => !v.trim(),
    )
  )
    simpleError(
      "argument",
      "Explicit caller reason, claim and proposed warrant, not automatic logical inference.",
    );
  return {
    candidateSuppressedWarrant: input.warrantExplicitlyStated
      ? ""
      : input.callerProposedWarrant,
    warrantWasExplicit: input.warrantExplicitlyStated,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    statedReason: "Socrates is human",
    declaredClaim: "Socrates is mortal",
    callerProposedWarrant: "All humans are mortal",
    warrantExplicitlyStated: false,
  },
  output: {
    result: {
      candidateSuppressedWarrant: "All humans are mortal",
      warrantWasExplicit: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "rhetoric/enthymeme-suppressed-premise-exposer",
  title: "Enthymeme Suppressed Premise Exposer",
  description:
    "Expose an explicitly caller-proposed suppressed warrant relative to stated reason/claim; does not prove that the warrant is true or logically necessary.",
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
