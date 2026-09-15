import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, bounded } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly layers: number;
  readonly blockThicknessMm: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "layers", label: "Layers", kind: "number" },
  { id: "blockThicknessMm", label: "Block thickness mm", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  bounded(i.layers, "layers", 0, 1000000);
  positive(i.blockThicknessMm, "thickness");
  return { idealHeightMm: i.layers * i.blockThicknessMm };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { layers: 18, blockThicknessMm: 15 },
  output: { result: { idealHeightMm: 270 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/jenga-layer-height-blocks-count",
  title: "Jenga Layer Height Blocks Count",
  description:
    "Ideal Jenga tower height from completed three-block layers and actual block thickness, excluding gaps/lean.",
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
