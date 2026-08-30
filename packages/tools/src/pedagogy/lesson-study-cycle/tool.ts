import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly cycleStartDay: number;
  readonly planDays: number;
  readonly teachDays: number;
  readonly observeDays: number;
  readonly reflectDays: number;
  readonly reviseDays: number;
}>;
export type Output = Readonly<{
  readonly phaseNames: readonly string[];
  readonly phaseStartDays: readonly number[];
  readonly cycleEndDay: number;
}>;
export const calculate = (input: Input): Output => {
  const durations = [
    input.planDays,
    input.teachDays,
    input.observeDays,
    input.reflectDays,
    input.reviseDays,
  ];
  if (
    !Number.isSafeInteger(input.cycleStartDay) ||
    durations.some((v) => !Number.isSafeInteger(v) || v < 1)
  )
    simpleError(
      "planDays",
      "Cycle day and all phase durations must be positive integers.",
    );
  let day = input.cycleStartDay;
  const phaseStartDays = durations.map((v) => {
    const start = day;
    day += v;
    return start;
  });
  return {
    phaseNames: ["plan", "teach", "observe", "reflect", "revise"],
    phaseStartDays,
    cycleEndDay: day,
  };
};
export const exampleInput = {
  cycleStartDay: 1,
  planDays: 3,
  teachDays: 1,
  observeDays: 1,
  reflectDays: 2,
  reviseDays: 2,
} satisfies Input;
export const exampleOutput = {
  phaseNames: ["plan", "teach", "observe", "reflect", "revise"],
  phaseStartDays: [1, 4, 5, 6, 8],
  cycleEndDay: 10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/lesson-study-cycle",
  title: "Lesson Study Cycle",
  description:
    "Schedule a lesson-study plan, teaching, observation, reflection, and revision cycle.",
  inputs: [
    { id: "cycleStartDay", label: "Cycle start day", kind: "number" },
    { id: "planDays", label: "Plan days", kind: "number" },
    { id: "teachDays", label: "Teach days", kind: "number" },
    { id: "observeDays", label: "Observe days", kind: "number" },
    { id: "reflectDays", label: "Reflect days", kind: "number" },
    { id: "reviseDays", label: "Revise days", kind: "number" },
  ],
  outputs: [
    { id: "phaseNames", label: "Phase names", kind: "stringList" },
    { id: "phaseStartDays", label: "Phase start days", kind: "numberList" },
    { id: "cycleEndDay", label: "Cycle end day", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      cycleStartDay: value.cycleStartDay as number,
      planDays: value.planDays as number,
      teachDays: value.teachDays as number,
      observeDays: value.observeDays as number,
      reflectDays: value.reflectDays as number,
      reviseDays: value.reviseDays as number,
    }),
});
export const run = tool.execute;
export default tool;
