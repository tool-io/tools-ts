import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, bounded } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly layers: number;
  readonly blockThicknessMm: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "layers", label: "Layers", kind: "number" },
  { id: "blockThicknessMm", label: "Block thickness mm", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  bounded(i.layers, "layers", 0, 1000000);
  positive(i.blockThicknessMm, "thickness");
  return { idealHeightMm: i.layers * i.blockThicknessMm };
};
export const calculate = (i: Input) => {
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

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { idealHeightMm: { type: "number" } },
        required: ["idealHeightMm"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
