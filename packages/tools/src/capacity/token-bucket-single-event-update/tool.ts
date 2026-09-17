import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  capacity: number;
  tokens: number;
  rate: number;
  elapsed: number;
  cost: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "capacity", kind: "number", label: "capacity" },
  { id: "tokens", kind: "number", label: "tokens" },
  { id: "rate", kind: "number", label: "rate" },
  { id: "elapsed", kind: "number", label: "elapsed" },
  { id: "cost", kind: "number", label: "cost" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(
    i.capacity >= 0 &&
      i.tokens >= 0 &&
      i.tokens <= i.capacity &&
      i.rate >= 0 &&
      i.elapsed >= 0 &&
      i.cost >= 0,
  );
  const available = Math.min(i.capacity, i.tokens + i.rate * i.elapsed),
    admitted = available >= i.cost;
  return H.finish({
    available,
    admitted,
    tokens: admitted ? available - i.cost : available,
  });
};
export const example = {
  input: { capacity: 10, tokens: 2, rate: 2, elapsed: 3, cost: 5 },
  output: { result: { available: 8, admitted: true, tokens: 3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "capacity/token-bucket-single-event-update",
  title: "Token Bucket Single Event Update",
  description:
    "Apply one deterministic token-bucket event with bounded refill and all-or-nothing consumption; no real-time state, burst guarantee or distributed synchronization.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
