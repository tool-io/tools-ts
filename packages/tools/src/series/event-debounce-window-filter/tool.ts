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
  quietWindow: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "eventTimes", label: "Event times", kind: "numberList" },
  { id: "quietWindow", label: "Quiet window", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  nonnegative(i.quietWindow, "window");
  eventOrder(i.eventTimes);
  const acceptedIndexes = i.eventTimes.flatMap((t, j) =>
    j === i.eventTimes.length - 1 || i.eventTimes[j + 1] - t > i.quietWindow
      ? [j]
      : [],
  );
  return {
    acceptedIndexes,
    emissionTimes: acceptedIndexes.map((j) => i.eventTimes[j] + i.quietWindow),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { eventTimes: [0, 1, 5], quietWindow: 2 },
  output: { result: { acceptedIndexes: [1, 2], emissionTimes: [3, 7] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "series/event-debounce-window-filter",
  title: "Event Debounce Window Filter",
  description:
    "Plan trailing-edge debounce emissions: retain the last event of each burst separated by strictly more than the quiet window; assumes no future events after the supplied list.",
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
