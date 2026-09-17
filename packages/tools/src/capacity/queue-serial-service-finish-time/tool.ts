import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  now: number;
  serverFreeAt: number;
  ahead: number;
  serviceDuration: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "now", kind: "number", label: "now" },
  { id: "serverFreeAt", kind: "number", label: "serverFreeAt" },
  { id: "ahead", kind: "integer", label: "ahead" },
  { id: "serviceDuration", kind: "number", label: "serviceDuration" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.ahead);
  H.positive(i.serviceDuration);
  const start = Math.max(i.now, i.serverFreeAt) + i.ahead * i.serviceDuration;
  return H.finish({ start, finish: start + i.serviceDuration });
};
export const example = {
  input: { now: 10, serverFreeAt: 12, ahead: 2, serviceDuration: 3 },
  output: { result: { start: 18, finish: 21 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "capacity/queue-serial-service-finish-time",
  title: "Queue Serial Service Finish Time",
  description:
    "Deterministic serial-service timing for an item behind a supplied count of equal-service jobs; not a stochastic queueing or guaranteed completion forecast.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
