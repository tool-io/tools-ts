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
      definition:
        "Paramutation is a heritable change in one allele induced by interaction with another allele; expression correlation alone is insufficient evidence.",
    }),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { key: "definition" },
  output: {
    result: {
      reference:
        "Paramutation is a heritable change in one allele induced by interaction with another allele; expression correlation alone is insufficient evidence.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "epigenetics/paramutation-crosstalk-note-generator",
  title: "Paramutation Allele Communication Cross-Talk Note Generator",
  description:
    "Retrieve the paramutation concept without inferring allele communication. Bounded exact-key educational reference only; observations and applicability must be established independently.",
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
