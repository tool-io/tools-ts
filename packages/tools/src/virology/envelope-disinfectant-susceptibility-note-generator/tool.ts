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
      enveloped:
        "Lipid-envelope disruption may increase susceptibility to some agents; validation still depends on virus, product, concentration, matrix and contact time.",
      "non-enveloped":
        "Lack of a lipid envelope can increase resistance to some envelope-disrupting agents; no universal resistance ranking follows.",
    }),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { key: "enveloped" },
  output: {
    result: {
      reference:
        "Lipid-envelope disruption may increase susceptibility to some agents; validation still depends on virus, product, concentration, matrix and contact time.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/envelope-disinfectant-susceptibility-note-generator",
  title:
    "Enveloped versus Non-enveloped Disinfectant Susceptibility Class Note",
  description:
    "Explain envelope-dependent disinfectant susceptibility without a guaranteed inactivation claim. Bounded exact-key educational reference only; observations and applicability must be established independently.",
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
