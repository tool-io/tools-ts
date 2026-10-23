import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly fontPx: number;
  readonly indentEm: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "fontPx", label: "Font px", kind: "number" },
  { id: "indentEm", label: "Indent em", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  positive(i.fontPx, "font");
  nonnegative(i.indentEm, "indent");
  return { indentPx: i.fontPx * i.indentEm };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { fontPx: 16, indentEm: 1.5 },
  output: { result: { indentPx: 24 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "typography/text-indent-em-rule",
  title: "Text Indent em Rule",
  description:
    "Text indent pixel value for caller selected em rule; not universal typographic convention.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { indentPx: { type: "number" } },
        required: ["indentPx"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
