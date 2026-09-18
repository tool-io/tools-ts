import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ stencil: readonly (readonly number[])[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "stencil", label: "stencil", kind: "matrix" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.stencil(i.stencil);
  return H.finish({ stencil: i.stencil.map(([y, x]) => [-y, -x]) });
};
export const example = {
  input: {
    stencil: [
      [0, 0],
      [0, 1],
    ],
  },
  output: {
    result: {
      stencil: [
        [0, 0],
        [0, -1],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "morphology/stencil-offset-reflection",
  title: "Binary Mask Stencil Offset Reflection",
  description:
    "Reflect explicit bounded binary-mask stencil offsets about the origin without changing their order; used for asymmetric dilation/erosion conventions.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
