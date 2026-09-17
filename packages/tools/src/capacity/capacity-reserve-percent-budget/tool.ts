import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ capacity: number; reservePercent: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "capacity", kind: "integer", label: "capacity" },
  { id: "reservePercent", kind: "number", label: "reservePercent" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.capacity);
  H.check(i.reservePercent >= 0 && i.reservePercent <= 100);
  const reserved = Math.ceil((i.capacity * i.reservePercent) / 100);
  return H.finish({ reserved, usable: i.capacity - reserved });
};
export const example = {
  input: { capacity: 11, reservePercent: 10 },
  output: { result: { reserved: 2, usable: 9 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "capacity/capacity-reserve-percent-budget",
  title: "Capacity Reserve Percent Budget",
  description:
    "Reserve a ceiling-rounded percentage of integer capacity and expose the usable whole-unit budget; explicit arithmetic, not availability certification.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
