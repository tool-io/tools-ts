import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  sum,
  strictlyIncreasing,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerClassDurationMinutes: number;
  readonly callerBreakStartMinutes: readonly number[];
  readonly callerBreakDurationMinutes: readonly number[];
}>;
export type Output = Readonly<{
  readonly callerScheduledBreakMinutes: number;
  readonly unallocatedClassMinutes: number;
}>;
const inputFields = [
  {
    id: "callerClassDurationMinutes",
    label: "Caller class duration minutes",
    kind: "number",
  },
  {
    id: "callerBreakStartMinutes",
    label: "Caller break start minutes",
    kind: "numberList",
  },
  {
    id: "callerBreakDurationMinutes",
    label: "Caller break duration minutes",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.callerClassDurationMinutes, "callerClassDurationMinutes");
  input.callerBreakStartMinutes.forEach((v) =>
    nonnegative(v, "callerBreakStartMinutes"),
  );
  input.callerBreakDurationMinutes.forEach((v) =>
    nonnegative(v, "callerBreakDurationMinutes"),
  );
  aligned(
    input.callerBreakStartMinutes,
    input.callerBreakDurationMinutes,
    "callerBreakStartMinutes",
  );
  strictlyIncreasing(input.callerBreakStartMinutes, "breaks");
  input.callerBreakStartMinutes.forEach((v, i) => {
    if (
      v + input.callerBreakDurationMinutes[i] >
        input.callerClassDurationMinutes ||
      (i &&
        v <
          input.callerBreakStartMinutes[i - 1] +
            input.callerBreakDurationMinutes[i - 1])
    )
      simpleError(
        "breaks",
        "Nonoverlapping break windows inside declaredclass.",
      );
  });
  const b = sum(input.callerBreakDurationMinutes);
  return {
    callerScheduledBreakMinutes: b,
    unallocatedClassMinutes: input.callerClassDurationMinutes - b,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerClassDurationMinutes: 90,
  callerBreakStartMinutes: [30, 60],
  callerBreakDurationMinutes: [5, 5],
} satisfies Input;
export const exampleOutput = {
  callerScheduledBreakMinutes: 10,
  unallocatedClassMinutes: 80,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/hydration-break-per-90min-class-lookup",
  title: "Hydration Break Per 90min Class Lookup",
  description:
    "Audit caller already approved hydration/access break windows within a class; no recommended fluid quantity or physiologic adequacy. Caller independently establishes score/style/protocol/reference applicability; not physical readiness, safe training or injury risk diagnosis.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerScheduledBreakMinutes",
      label: "Caller scheduled break minutes",
      kind: "number",
    },
    {
      id: "unallocatedClassMinutes",
      label: "Unallocated class minutes",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerClassDurationMinutes: value.callerClassDurationMinutes as number,
      callerBreakStartMinutes:
        value.callerBreakStartMinutes as readonly number[],
      callerBreakDurationMinutes:
        value.callerBreakDurationMinutes as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
