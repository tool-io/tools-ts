import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  simpleError,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly fieldWidth: number;
  readonly paleWidth: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "fieldWidth", label: "Field width", kind: "number" },
  { id: "paleWidth", label: "Pale width", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.fieldWidth, "fieldWidth");
  positive(input.paleWidth, "paleWidth");
  if (input.paleWidth > input.fieldWidth)
    simpleError("width", "Band fits declared envelope.");
  return {
    leftEdgeX: (input.fieldWidth - input.paleWidth) / 2,
    rightEdgeX: (input.fieldWidth + input.paleWidth) / 2,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { fieldWidth: 100, paleWidth: 20 },
  output: { result: { leftEdgeX: 40, rightEdgeX: 60 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "heraldry/pale-band-position",
  title: "Pale Vertical Band Position Calculator",
  description:
    "Center a vertical pale band inside a caller rectangular field envelope.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
