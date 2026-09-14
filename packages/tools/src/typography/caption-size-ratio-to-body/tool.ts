import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly captionPx: number;
  readonly bodyPx: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "captionPx", label: "Caption px", kind: "number" },
  { id: "bodyPx", label: "Body px", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  positive(i.captionPx, "size");
  positive(i.bodyPx, "body");
  return { sizeRatio: i.captionPx / i.bodyPx };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { captionPx: 12, bodyPx: 16 },
  output: { result: { sizeRatio: 0.75 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "typography/caption-size-ratio-to-body",
  title: "Caption Size Ratio To Body",
  description:
    "Measured captionPx to body size ratio, not an accessibility or style prescription.",
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
