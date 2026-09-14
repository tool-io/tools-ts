import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch52-shared.js";
export type Input = Readonly<{ readonly messageCount: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "messageCount", label: "Message count", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  bounded(i.messageCount, "messages", 0, 1000000000);
  return { conceptualHashInvocations: 2 * i.messageCount };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { messageCount: 3 },
  output: { result: { conceptualHashInvocations: 6 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cryptography/hmac-input-two-hash-call-counter",
  title: "HMAC Two-Hash-Call Counter",
  description:
    "Conceptual two hash-function invocations per HMAC message (inner and outer), not compression-block counts or performance prediction.",
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
