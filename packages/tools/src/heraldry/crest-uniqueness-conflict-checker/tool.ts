import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, unique } from "../batch43-shared.js";

export type Input = Readonly<{
  readonly candidateCrestId: string;
  readonly callerRegisteredCrestIds: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "candidateCrestId", label: "Candidate crest id", kind: "string" },
  {
    id: "callerRegisteredCrestIds",
    label: "Caller registered crest ids",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  unique(input.callerRegisteredCrestIds, "crest registry");
  return {
    exactCallerRegistryConflict: input.callerRegisteredCrestIds.includes(
      input.candidateCrestId,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    candidateCrestId: "crest-a",
    callerRegisteredCrestIds: ["crest-a", "crest-b"],
  },
  output: { result: { exactCallerRegistryConflict: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "heraldry/crest-uniqueness-conflict-checker",
  title: "Crest Above Helmet Uniqueness Conflict Checker",
  description:
    "Exact caller crest registry ID cross-match, not image similarity or proof of legal uniqueness.",
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
