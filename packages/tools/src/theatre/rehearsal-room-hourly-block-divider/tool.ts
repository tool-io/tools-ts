import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly roomStartMinute: number;
  readonly roomEndMinute: number;
  readonly callerBlockWorkMinutes: number;
  readonly callerBlockResetMinutes: number;
}>;
export type Output = Readonly<{
  readonly plannedWorkIntervalsMinutes: readonly (readonly number[])[];
  readonly unallocatedTailMinutes: number;
}>;
const inputFields = [
  { id: "roomStartMinute", label: "Room start minute", kind: "number" },
  { id: "roomEndMinute", label: "Room end minute", kind: "number" },
  {
    id: "callerBlockWorkMinutes",
    label: "Caller block work minutes",
    kind: "number",
  },
  {
    id: "callerBlockResetMinutes",
    label: "Caller block reset minutes",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerBlockWorkMinutes, "callerBlockWorkMinutes");
  nonnegative(input.roomStartMinute, "roomStartMinute");
  nonnegative(input.roomEndMinute, "roomEndMinute");
  nonnegative(input.callerBlockResetMinutes, "callerBlockResetMinutes");
  if (input.roomEndMinute < input.roomStartMinute)
    simpleError("room", "Ordered room booking required.");
  const blocks: number[][] = [];
  let start = input.roomStartMinute;
  while (start + input.callerBlockWorkMinutes <= input.roomEndMinute) {
    if (blocks.length >= 128)
      simpleError("scope", "More than 128 rehearsal blocks; narrow booking.");
    blocks.push([start, start + input.callerBlockWorkMinutes]);
    start += input.callerBlockWorkMinutes + input.callerBlockResetMinutes;
  }
  const final = blocks.at(-1)?.[1] ?? input.roomStartMinute;
  return {
    plannedWorkIntervalsMinutes: blocks,
    unallocatedTailMinutes: input.roomEndMinute - final,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  roomStartMinute: 0,
  roomEndMinute: 130,
  callerBlockWorkMinutes: 50,
  callerBlockResetMinutes: 10,
} satisfies Input;
export const exampleOutput = {
  plannedWorkIntervalsMinutes: [
    [0, 50],
    [60, 110],
  ],
  unallocatedTailMinutes: 20,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/rehearsal-room-hourly-block-divider",
  title: "Rehearsal Room Hourly Block Divider Tool",
  description:
    "Partition actual room booking into whole caller work blocks with reset gaps, retain tail rather than shorten final block; no universal rehearsal contract or break rule.",
  inputs: inputFields,
  outputs: [
    {
      id: "plannedWorkIntervalsMinutes",
      label: "Planned work intervals minutes",
      kind: "matrix",
    },
    {
      id: "unallocatedTailMinutes",
      label: "Unallocated tail minutes",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      roomStartMinute: value.roomStartMinute as number,
      roomEndMinute: value.roomEndMinute as number,
      callerBlockWorkMinutes: value.callerBlockWorkMinutes as number,
      callerBlockResetMinutes: value.callerBlockResetMinutes as number,
    }),
});
export const run = tool.execute;
export default tool;
