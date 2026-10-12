import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ bits: string; position: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "bits", kind: "string", label: "bits" },
  { id: "position", kind: "integer", label: "position" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.bits(i.bits);
  H.int(i.position, 0, i.bits.length);
  const positions = i.bits
    .split("")
    .flatMap((x, j) => (x === "1" && j < i.position ? [j] : []));
  return H.finish({ position: positions.at(-1) ?? null });
};
export const example = {
  input: { bits: "10100", position: 2 },
  output: { result: { position: 0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bits/bitstring-previous-set-position",
  title: "Bit String Previous Set Position",
  description:
    "Find the last set bit strictly before an explicit position; null preserves absence instead of inventing an index.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          position: { anyOf: [{ type: "number" }, { type: "null" }] },
        },
        required: ["position"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
