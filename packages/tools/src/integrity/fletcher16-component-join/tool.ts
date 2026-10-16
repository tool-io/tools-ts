import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ low: number; high: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "low", kind: "integer", label: "low" },
  { id: "high", kind: "integer", label: "high" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.int(i.low, 0, 255);
  H.int(i.high, 0, 255);
  return H.finish({ value: i.high * 256 + i.low });
};
export const example = {
  input: { low: 1, high: 2 },
  output: { result: { value: 513 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "integrity/fletcher16-component-join",
  title: "Fletcher16 Component Joiner",
  description:
    "Split or join packed Fletcher-16 8-bit checksum components by numeric lanes; does not recompute or verify checksum residues.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { value: { type: "number" } },
        required: ["value"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
