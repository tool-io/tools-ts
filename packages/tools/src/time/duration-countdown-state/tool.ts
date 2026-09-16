import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ deadline: number; now: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "deadline", kind: "number", label: "deadline" },
  { id: "now", kind: "number", label: "now" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const signedRemaining = i.deadline - i.now;
  return H.finish({
    signedRemaining,
    remaining: Math.max(0, signedRemaining),
    state:
      signedRemaining > 0
        ? "pending"
        : signedRemaining === 0
          ? "due"
          : "expired",
  });
};
export const example = {
  input: { deadline: 10, now: 12 },
  output: { result: { signedRemaining: -2, remaining: 0, state: "expired" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "time/duration-countdown-state",
  title: "Duration Countdown State",
  description:
    "Classify an explicit countdown observation, retaining signed lateness; does not read a clock or schedule anything.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
