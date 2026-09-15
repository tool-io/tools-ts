import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, sum, bounded } from "../batch52-shared.js";
export type Input = Readonly<{ readonly bytes: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "bytes", label: "Bytes", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  i.bytes.forEach((v) => bounded(v, "byte", 0, 255));
  return { checksum: sum(i.bytes) % 256 };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { bytes: [255, 1, 2] },
  output: { result: { checksum: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/save-file-checksum-simple-sum8-retro",
  title: "Retro Save-File Sum8 Checksum",
  description:
    "Unsigned additive sum8 checksum over caller supplied byte sequence, not a game-specific file layout, hash or authentication check.",
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
