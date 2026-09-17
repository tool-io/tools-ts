import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  capacity: number;
  used: number;
  reservation: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "capacity", kind: "integer", label: "capacity" },
  { id: "used", kind: "integer", label: "used" },
  { id: "reservation", kind: "integer", label: "reservation" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.capacity);
  H.int(i.used, 0, i.capacity);
  H.int(i.reservation);
  return H.finish({
    freeBytes: i.capacity - i.used - i.reservation,
    overReserved: i.used + i.reservation > i.capacity,
  });
};
export const example = {
  input: { capacity: 100, used: 70, reservation: 40 },
  output: { result: { freeBytes: -10, overReserved: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "capacity/buffer-free-bytes-after-reservation",
  title: "Buffer Free Bytes after Reservation",
  description:
    "Audit a proposed byte-buffer reservation retaining negative free-space evidence; does not allocate memory or silently clamp over-reservation.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
