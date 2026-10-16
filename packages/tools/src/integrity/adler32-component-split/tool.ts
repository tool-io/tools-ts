import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ value: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "value", kind: "integer", label: "value" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.int(i.value, 0, 4294967295);
  return H.finish({ low: i.value % 65536, high: Math.floor(i.value / 65536) });
};
export const example = {
  input: { value: 131073 },
  output: { result: { low: 1, high: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "integrity/adler32-component-split",
  title: "Adler32 Component Splitter",
  description:
    "Split or join packed Adler-32 16-bit checksum components by numeric lanes; does not recompute or verify checksum residues.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { low: { type: "number" }, high: { type: "number" } },
        required: ["low", "high"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
