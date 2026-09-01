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
  capacity,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedRunningCondensateKgHour: number;
  readonly callerStartupLoadMultiplier: number;
  readonly callerTrapIds: readonly string[];
  readonly callerVerifiedMatchedDifferentialCapacityKgHour: readonly number[];
}>;
export type Output = Readonly<{
  readonly callerStartupCondensateBudgetKgHour: number;
  readonly callerCompatibleTrapIds: readonly string[];
}>;
const inputFields = [
  {
    id: "observedRunningCondensateKgHour",
    label: "Observed running condensate kg hour",
    kind: "number",
  },
  {
    id: "callerStartupLoadMultiplier",
    label: "Caller startup load multiplier",
    kind: "number",
  },
  { id: "callerTrapIds", label: "Caller trap ids", kind: "stringList" },
  {
    id: "callerVerifiedMatchedDifferentialCapacityKgHour",
    label: "Caller verified matched differential capacity kg hour",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(
    input.observedRunningCondensateKgHour,
    "observedRunningCondensateKgHour",
  );
  nonnegative(input.callerStartupLoadMultiplier, "callerStartupLoadMultiplier");
  input.callerVerifiedMatchedDifferentialCapacityKgHour.forEach((v) =>
    nonnegative(v, "callerVerifiedMatchedDifferentialCapacityKgHour"),
  );
  if (input.callerStartupLoadMultiplier < 1)
    simpleError("startup", "Startup multiplier at least one required.");
  const required =
    input.observedRunningCondensateKgHour * input.callerStartupLoadMultiplier;
  return {
    callerStartupCondensateBudgetKgHour: required,
    callerCompatibleTrapIds: capacity(
      input.callerTrapIds,
      input.callerVerifiedMatchedDifferentialCapacityKgHour,
      required,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedRunningCondensateKgHour: 100,
  callerStartupLoadMultiplier: 2,
  callerTrapIds: ["a", "b"],
  callerVerifiedMatchedDifferentialCapacityKgHour: [150, 250],
} satisfies Input;
export const exampleOutput = {
  callerStartupCondensateBudgetKgHour: 200,
  callerCompatibleTrapIds: ["b"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/steam-trap-capacity",
  title: "Plumbing Steam Trap Capacity Calculator",
  description:
    "Budget actual condensate and independent startup multiplier against matched differential-pressure trap capacities; no steam trap type/piping or operation approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerStartupCondensateBudgetKgHour",
      label: "Caller startup condensate budget kg hour",
      kind: "number",
    },
    {
      id: "callerCompatibleTrapIds",
      label: "Caller compatible trap ids",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedRunningCondensateKgHour:
        value.observedRunningCondensateKgHour as number,
      callerStartupLoadMultiplier: value.callerStartupLoadMultiplier as number,
      callerTrapIds: value.callerTrapIds as readonly string[],
      callerVerifiedMatchedDifferentialCapacityKgHour:
        value.callerVerifiedMatchedDifferentialCapacityKgHour as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
