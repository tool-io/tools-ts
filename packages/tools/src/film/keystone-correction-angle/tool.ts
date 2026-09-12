import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualProjectedTopWidth: number;
  readonly actualProjectedBottomWidth: number;
  readonly actualProjectedHeight: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualProjectedTopWidth",
    label: "Actual projected top width",
    kind: "number",
  },
  {
    id: "actualProjectedBottomWidth",
    label: "Actual projected bottom width",
    kind: "number",
  },
  {
    id: "actualProjectedHeight",
    label: "Actual projected height",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.actualProjectedTopWidth, "actualProjectedTopWidth");
  positive(input.actualProjectedBottomWidth, "actualProjectedBottomWidth");
  positive(input.actualProjectedHeight, "actualProjectedHeight");
  return {
    value:
      (Math.atan(
        (input.actualProjectedTopWidth - input.actualProjectedBottomWidth) /
          (2 * input.actualProjectedHeight),
      ) *
        180) /
      Math.PI,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualProjectedTopWidth: 5,
    actualProjectedBottomWidth: 1,
    actualProjectedHeight: 2,
  },
  output: { result: { value: 45 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "film/keystone-correction-angle",
  title: "Keystone Correction Angle Calculator",
  description:
    "Declared planar trapezoid SIDE wall angle from signed(top width\u2212bottom width)/(2height), not infer projector tilt/lens geometry or actual correctivehomography.",
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
