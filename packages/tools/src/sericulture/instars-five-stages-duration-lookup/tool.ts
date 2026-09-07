import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, nonnegative, sum } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerMatchedFiveInstarDurationsDays: readonly number[];
  readonly callerMatchedFourMoltDurationsDays: readonly number[];
}>;
export type Output = Readonly<{
  readonly callerFeedingStageDays: number;
  readonly callerMoltStageDays: number;
  readonly callerCombinedInstarDays: number;
}>;
const inputFields = [
  {
    id: "callerMatchedFiveInstarDurationsDays",
    label: "Caller matched five instar durations days",
    kind: "numberList",
  },
  {
    id: "callerMatchedFourMoltDurationsDays",
    label: "Caller matched four molt durations days",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerMatchedFiveInstarDurationsDays.forEach((v) =>
    nonnegative(v, "callerMatchedFiveInstarDurationsDays"),
  );
  input.callerMatchedFourMoltDurationsDays.forEach((v) =>
    nonnegative(v, "callerMatchedFourMoltDurationsDays"),
  );
  if (
    input.callerMatchedFiveInstarDurationsDays.length !== 5 ||
    input.callerMatchedFourMoltDurationsDays.length !== 4
  )
    simpleError(
      "stages",
      "Explicit five feeding instars and four intervening molts.",
    );
  const a = sum(input.callerMatchedFiveInstarDurationsDays),
    b = sum(input.callerMatchedFourMoltDurationsDays);
  return {
    callerFeedingStageDays: a,
    callerMoltStageDays: b,
    callerCombinedInstarDays: a + b,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerMatchedFiveInstarDurationsDays: [2, 3, 4, 5, 6],
  callerMatchedFourMoltDurationsDays: [1, 1, 1, 1],
} satisfies Input;
export const exampleOutput = {
  callerFeedingStageDays: 20,
  callerMoltStageDays: 4,
  callerCombinedInstarDays: 24,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sericulture/instars-five-stages-duration-lookup",
  title: "Instars Five Stages Duration Lookup",
  description:
    "Audit independently verified stage duration inventory with feeding and intervening molt sums separate; no spinning completion date forecast or fixed strain schedule. Caller independently verifies strain, stage, protocol and evidence; not disease-free, biological adequacy or process-safety certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerFeedingStageDays",
      label: "Caller feeding stage days",
      kind: "number",
    },
    {
      id: "callerMoltStageDays",
      label: "Caller molt stage days",
      kind: "number",
    },
    {
      id: "callerCombinedInstarDays",
      label: "Caller combined instar days",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerMatchedFiveInstarDurationsDays:
        value.callerMatchedFiveInstarDurationsDays as readonly number[],
      callerMatchedFourMoltDurationsDays:
        value.callerMatchedFourMoltDurationsDays as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
