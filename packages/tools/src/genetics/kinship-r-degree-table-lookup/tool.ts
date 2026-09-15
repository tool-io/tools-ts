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
      "first-degree":
        "Expected pedigree relationship r=0.5 for ordinary parent-child or full siblings; not a realized genomic estimate.",
      "second-degree":
        "Expected pedigree relationship r=0.25 for ordinary grandparent-grandchild, avuncular or half siblings.",
      "third-degree":
        "Expected pedigree relationship r=0.125 for ordinary first cousins.",
    }),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { key: "first-degree" },
  output: {
    result: {
      reference:
        "Expected pedigree relationship r=0.5 for ordinary parent-child or full siblings; not a realized genomic estimate.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/kinship-r-degree-table-lookup",
  title: "Relationship Degree Kinship r Value Lookup Table (0.5, 0.25, 0.125)",
  description:
    "Retrieve idealized outbred pedigree relationship coefficients, distinct from kinship coefficient phi=r/2. Bounded exact-key educational reference only; observations and applicability must be established independently.",
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
