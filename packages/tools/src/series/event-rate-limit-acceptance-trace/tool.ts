import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  positive,
  eventOrder,
} from "../batch53-shared.js";

export type Input = Readonly<{
  eventTimes: readonly number[];
  windowDuration: number;
  maximumAccepted: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "eventTimes", label: "Event times", kind: "numberList" },
  { id: "windowDuration", label: "Window duration", kind: "number" },
  { id: "maximumAccepted", label: "Maximum accepted", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  positive(i.windowDuration, "window");
  bounded(i.maximumAccepted, "maximum", 1, 10000);
  eventOrder(i.eventTimes);
  const accepted: number[] = [],
    trace: boolean[] = [];
  i.eventTimes.forEach((t, j) => {
    const active = accepted.filter(
        (k) => i.eventTimes[k] > t - i.windowDuration,
      ).length,
      ok = active < i.maximumAccepted;
    trace.push(ok);
    if (ok) accepted.push(j);
  });
  return { acceptedIndexes: accepted, acceptance: trace };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { eventTimes: [0, 1, 2, 5], windowDuration: 3, maximumAccepted: 2 },
  output: {
    result: {
      acceptedIndexes: [0, 1, 3],
      acceptance: [true, true, false, true],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "series/event-rate-limit-acceptance-trace",
  title: "Event Rate Limit Acceptance Trace",
  description:
    "Trace sliding-window rate limits over accepted events in (t−window,t]; rejected events do not consume acceptance capacity.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
