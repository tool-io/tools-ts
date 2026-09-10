import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly egoId: string;
  readonly independentlyObservedDiscussionPartnerIds: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "egoId", label: "Ego id", kind: "string" },
  {
    id: "independentlyObservedDiscussionPartnerIds",
    label: "Independently observed discussion partner ids",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (
    !input.egoId.trim() ||
    input.independentlyObservedDiscussionPartnerIds.some(
      (v) => !v.trim() || v === input.egoId,
    )
  )
    simpleError("partners", "Explicit nonempty partner IDs distinct from ego.");
  const ids = [...new Set(input.independentlyObservedDiscussionPartnerIds)];
  return {
    distinctObservedDiscussionPartnerCount: ids.length,
    distinctObservedDiscussionPartnerIds: ids,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    egoId: "ego",
    independentlyObservedDiscussionPartnerIds: ["a", "a", "b"],
  },
  output: {
    result: {
      distinctObservedDiscussionPartnerCount: 2,
      distinctObservedDiscussionPartnerIds: ["a", "b"],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/political-discussion-network-size",
  title: "Political Discussion Network Size Calculator",
  description:
    "Deduplicate actual independently observed political-discussion partner IDs; do not infer conversation, political views or social capital from contacts. Unobserved ties remain outside scope.",
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
