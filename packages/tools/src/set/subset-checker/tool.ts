import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualCandidateSubset: readonly string[];
  readonly actualSuperset: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualCandidateSubset",
    label: "Actual candidate subset",
    kind: "stringList",
  },
  { id: "actualSuperset", label: "Actual superset", kind: "stringList" },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const missing = [...new Set(input.actualCandidateSubset)].filter(
    (v) => !input.actualSuperset.includes(v),
  );
  return { isSubset: missing.length === 0, missingDistinctValues: missing };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualCandidateSubset: ["a"], actualSuperset: ["a", "b"] },
  output: { result: { isSubset: true, missingDistinctValues: [] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "set/subset-checker",
  title: "Subset Checker",
  description:
    "Case-sensitiveexactstring-set inclusion,duplicatesignored,emptycandidatevalid. Explicitboundedofflineconvention,not authoritative external identity,eligibility,clinical or safe-use determination.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
