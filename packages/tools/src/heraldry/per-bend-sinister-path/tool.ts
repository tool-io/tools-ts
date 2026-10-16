import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, canvas } from "../batch43-shared.js";

export type Input = Readonly<{
  readonly fieldWidth: number;
  readonly fieldHeight: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "fieldWidth", label: "Field width", kind: "number" },
  { id: "fieldHeight", label: "Field height", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  canvas(input.fieldWidth, input.fieldHeight);
  return { start: [input.fieldWidth, 0], end: [0, input.fieldHeight] };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { fieldWidth: 100, fieldHeight: 120 },
  output: { result: { start: [100, 0], end: [0, 120] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "heraldry/per-bend-sinister-path",
  title: "Per Bend Sinister Diagonal Path Generator",
  description:
    "Per-bend-sinister straight partition in viewer top-left x-right, y-down coordinates; not shield outline clipping.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          start: { type: "array", items: { type: "number" } },
          end: { type: "array", items: { type: "number" } },
        },
        required: ["start", "end"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
