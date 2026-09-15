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
      light:
        "Dimethyl mass shift +28.031300 Da per labeled amine for CH2O/NaBH3CN.",
      medium:
        "Common CD2O/NaBH3CN scheme gives +32.056407 Da per labeled amine; reagent scheme matters.",
      heavy:
        "Common 13CD2O/NaBD3CN scheme gives +36.075670 Da per labeled amine; reagent scheme matters.",
    }),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { key: "light" },
  output: {
    result: {
      reference:
        "Dimethyl mass shift +28.031300 Da per labeled amine for CH2O/NaBH3CN.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/dimethyl-label-massshift-lookup",
  title: "Dimethyl Label Light-Medium-Heavy Mass Shift Lookup",
  description:
    "Retrieve scheme-qualified dimethyl-label monoisotopic shifts per labeled amine, not per protein. Bounded exact-key educational reference only; observations and applicability must be established independently.",
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
