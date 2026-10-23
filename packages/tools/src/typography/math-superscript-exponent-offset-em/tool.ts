import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly emPx: number;
  readonly callerOffsetEm: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "emPx", label: "Em px", kind: "number" },
  { id: "callerOffsetEm", label: "Caller offset em", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  positive(i.emPx, "em");
  return { offsetPx: i.emPx * i.callerOffsetEm };
};
export const calculate = (i: Input) => {
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

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { offsetPx: { type: "number" } },
        required: ["offsetPx"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
