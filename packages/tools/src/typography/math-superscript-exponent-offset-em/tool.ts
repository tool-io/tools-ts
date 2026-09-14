import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly emPx: number;
  readonly callerOffsetEm: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "emPx", label: "Em px", kind: "number" },
  { id: "callerOffsetEm", label: "Caller offset em", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  positive(i.emPx, "em");
  return { offsetPx: i.emPx * i.callerOffsetEm };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { emPx: 16, callerOffsetEm: 0.3 },
  output: { result: { offsetPx: 4.8 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "typography/math-superscript-exponent-offset-em",
  title: "Math Exponent Offset em",
  description:
    "Convert caller chosen exponent baseline offset to pixels; does not infer OpenType MATH metrics.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
