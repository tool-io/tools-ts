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
      mechanism:
        "CUT&Tag uses antibody-tethered Tn5 tagmentation to integrate sequencing adapters near selected chromatin targets; loading and accessibility bias require assay controls.",
    }),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { key: "mechanism" },
  output: {
    result: {
      reference:
        "CUT&Tag uses antibody-tethered Tn5 tagmentation to integrate sequencing adapters near selected chromatin targets; loading and accessibility bias require assay controls.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "epigenetics/cuttag-tagmentation-note-generator",
  title: "CUT&Tag Tn5 Tagmentation Adapter Loading Note Generator",
  description:
    "Retrieve the CUT&Tag mechanism note without a laboratory protocol recommendation. Bounded exact-key educational reference only; observations and applicability must be established independently.",
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
