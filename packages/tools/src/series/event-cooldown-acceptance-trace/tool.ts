import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  eventOrder,
} from "../batch53-shared.js";

export type Input = Readonly<{
  eventTimes: readonly number[];
  cooldown: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "eventTimes", label: "Event times", kind: "numberList" },
  { id: "cooldown", label: "Cooldown", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  nonnegative(i.cooldown, "cooldown");
  eventOrder(i.eventTimes);
  let last: number | null = null;
  const indexes: number[] = [];
  i.eventTimes.forEach((t, j) => {
    if (last === null || t - last >= i.cooldown) {
      indexes.push(j);
      last = t;
    }
  });
  return { acceptedIndexes: indexes };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { eventTimes: [0, 1, 2, 5], cooldown: 2 },
  output: { result: { acceptedIndexes: [0, 2, 3] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "series/event-cooldown-acceptance-trace",
  title: "Event Cooldown Acceptance Trace",
  description:
    "Accept the first event and later events at least the caller cooldown after the last accepted event; rejected events do not restart the cooldown.",
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
