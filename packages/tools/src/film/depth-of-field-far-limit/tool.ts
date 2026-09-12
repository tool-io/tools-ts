import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualHyperfocalDistance: number;
  readonly actualFocusDistance: number;
  readonly actualFocalLength: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualHyperfocalDistance",
    label: "Actual hyperfocal distance",
    kind: "number",
  },
  { id: "actualFocusDistance", label: "Actual focus distance", kind: "number" },
  { id: "actualFocalLength", label: "Actual focal length", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.actualHyperfocalDistance, "actualHyperfocalDistance");
  positive(input.actualFocusDistance, "actualFocusDistance");
  positive(input.actualFocalLength, "actualFocalLength");
  if (
    input.actualFocusDistance < input.actualFocalLength ||
    input.actualHyperfocalDistance <=
      input.actualFocusDistance - input.actualFocalLength
  )
    simpleError("DOF", "Actual finite far-limit branch s≥f, s−f<H.");
  return {
    value:
      (input.actualHyperfocalDistance * input.actualFocusDistance) /
      (input.actualHyperfocalDistance -
        (input.actualFocusDistance - input.actualFocalLength)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualHyperfocalDistance: 4,
    actualFocusDistance: 2,
    actualFocalLength: 1,
  },
  output: { result: { value: 2.6666666666666665 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "film/depth-of-field-far-limit",
  title: "Depth of Field Far Limit Calculator",
  description:
    "Thin lens farDOFlimitHs/[H\u2212(s\u2212f)], actual same units/fixed CoCmodel, finitebranchs\u2212f<H. Infinity branch explicitly rejected not replaced finite value; near DOF is distinct.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
