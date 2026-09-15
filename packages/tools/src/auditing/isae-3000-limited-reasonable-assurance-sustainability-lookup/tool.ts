import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, exactLookup } from "../batch53-shared.js";

export type Input = Readonly<{ key: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "key", label: "Key", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  return {
    reference: exactLookup(i.key, {
      limited:
        "A lower assurance level than reasonable assurance with different evidence-gathering and conclusion wording.",
      reasonable:
        "A high but not absolute level of assurance; conclusions require sufficient appropriate evidence.",
    }),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { key: "limited" },
  output: {
    result: {
      reference:
        "A lower assurance level than reasonable assurance with different evidence-gathering and conclusion wording.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "auditing/isae-3000-limited-reasonable-assurance-sustainability-lookup",
  title: "ISAE 3000 Limited Reasonable Assurance Sustainability Lookup",
  description:
    "Compare ISAE 3000 assurance levels without claiming engagement eligibility or issuing a conclusion. Bounded exact-key educational reference only; observations and applicability must be established independently.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
