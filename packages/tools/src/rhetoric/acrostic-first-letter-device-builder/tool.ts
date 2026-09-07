import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch43-shared.js";

export type Input = Readonly<{
  readonly targetInitials: string;
  readonly callerReviewedLines: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "targetInitials", label: "Target initials", kind: "string" },
  {
    id: "callerReviewedLines",
    label: "Caller reviewed lines",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (
    input.targetInitials.length > 64 ||
    !input.targetInitials ||
    input.callerReviewedLines.length !==
      Array.from(input.targetInitials).length ||
    input.callerReviewedLines.some((v) => !v.trim())
  )
    simpleError(
      "lines",
      "Explicit target initials matched in count to nonempty independently reviewed lines.",
    );
  const initials = input.callerReviewedLines
    .map((v) => Array.from(v.trim())[0])
    .join("");
  return {
    acrosticMatches: initials === input.targetInitials,
    observedInitials: initials,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    targetInitials: "CAT",
    callerReviewedLines: ["Calm minds", "Art grows", "Trees stand"],
  },
  output: { result: { acrosticMatches: true, observedInitials: "CAT" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "rhetoric/acrostic-first-letter-device-builder",
  title: "Acrostic First Letter Device Builder",
  description:
    "Build/audit independently reviewed line initials against an explicit case-sensitive Unicode-scalar target, not generate poetry or infer mnemonic efficacy.",
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
