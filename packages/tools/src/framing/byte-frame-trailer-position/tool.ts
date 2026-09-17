import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ frameBytes: number; trailerBytes: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "frameBytes", kind: "integer", label: "frameBytes" },
  { id: "trailerBytes", kind: "integer", label: "trailerBytes" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.frameBytes, 0, 128);
  H.int(i.trailerBytes, 0, i.frameBytes);
  return H.finish({ start: i.frameBytes - i.trailerBytes, end: i.frameBytes });
};
export const example = {
  input: { frameBytes: 10, trailerBytes: 3 },
  output: { result: { start: 7, end: 10 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "framing/byte-frame-trailer-position",
  title: "Byte Frame Trailer Position",
  description:
    "Locate the half-open trailer span from a complete frame byte count and explicit trailer width; does not identify a checksum format.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
