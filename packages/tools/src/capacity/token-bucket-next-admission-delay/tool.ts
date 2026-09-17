import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  capacity: number;
  tokens: number;
  rate: number;
  cost: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "capacity", kind: "number", label: "capacity" },
  { id: "tokens", kind: "number", label: "tokens" },
  { id: "rate", kind: "number", label: "rate" },
  { id: "cost", kind: "number", label: "cost" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(
    i.capacity >= 0 &&
      i.tokens >= 0 &&
      i.tokens <= i.capacity &&
      i.rate >= 0 &&
      i.cost >= 0,
  );
  const impossible = i.cost > i.capacity || (i.cost > i.tokens && i.rate === 0);
  return H.finish({
    possible: !impossible,
    delay: impossible ? null : Math.max(0, i.cost - i.tokens) / (i.rate || 1),
  });
};
export const example = {
  input: { capacity: 10, tokens: 2, rate: 2, cost: 5 },
  output: { result: { possible: true, delay: 1.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "capacity/token-bucket-next-admission-delay",
  title: "Token Bucket Next Admission Delay",
  description:
    "Compute deterministic next token-bucket admission delay with null for impossible requests; assumes constant refill and no intervening consumption.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
