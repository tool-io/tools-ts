import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedPolicyText: string;
  readonly callerVerifiedPolicySource: string;
  readonly callerVerifiedExceptionText: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerVerifiedPolicyText",
    label: "Caller verified policy text",
    kind: "string",
  },
  {
    id: "callerVerifiedPolicySource",
    label: "Caller verified policy source",
    kind: "string",
  },
  {
    id: "callerVerifiedExceptionText",
    label: "Caller verified exception text",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (
    !input.callerVerifiedPolicyText.trim() ||
    !input.callerVerifiedPolicySource.trim() ||
    !input.callerVerifiedExceptionText.trim()
  )
    simpleError(
      "policy",
      "Independently verified explicit policy/source and exception text.",
    );
  return {
    note:
      "Policy source: " +
      input.callerVerifiedPolicySource +
      "\nPolicy: " +
      input.callerVerifiedPolicyText +
      "\nExceptions: " +
      input.callerVerifiedExceptionText,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerVerifiedPolicyText:
      "Use permitted pencils only; staff review material-specific exceptions.",
    callerVerifiedPolicySource: "reading-room-policy/edition",
    callerVerifiedExceptionText:
      "Request staff approval for material-specific exceptions.",
  },
  output: {
    result: {
      note: "Policy source: reading-room-policy/edition\nPolicy: Use permitted pencils only; staff review material-specific exceptions.\nExceptions: Request staff approval for material-specific exceptions.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archival-studies/pencil-only-policy-note-generator",
  title: "Pencil Only Policy Compliance Note Generator",
  description:
    "Format independently verified reading-room pencil-use policy and exception text, not invent universal archival compliance or alter actual room rules. No action, material safety or permission inferred.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
