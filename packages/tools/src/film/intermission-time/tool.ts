import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type IntermissionTimeInput = Readonly<{
  readonly pauseAtMinute: number;
  readonly resumeAtMinute: number;
}>;
export type IntermissionTimeOutput = Readonly<{
  readonly intermissionMinutes: number;
}>;

export const calculateIntermissionTime = (
  x: IntermissionTimeInput,
): IntermissionTimeOutput => {
  if (!Number.isFinite(x.pauseAtMinute) || x.pauseAtMinute < 0)
    simpleError("pauseAtMinute", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.resumeAtMinute) || x.resumeAtMinute < 0)
    simpleError("resumeAtMinute", "Provide a finite number at least 0.");
  if (x.resumeAtMinute < x.pauseAtMinute)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const intermissionMinutes = x.resumeAtMinute - x.pauseAtMinute;
  if (!Number.isFinite(intermissionMinutes))
    simpleError(
      "intermissionMinutes",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    intermissionMinutes: Object.is(intermissionMinutes, -0)
      ? 0
      : intermissionMinutes,
  };
};

export const example = {
  input: { pauseAtMinute: 60, resumeAtMinute: 70 },
  output: { intermissionMinutes: 10 },
} satisfies ToolExample<IntermissionTimeInput, IntermissionTimeOutput>;

export const tool = createSimpleTool({
  id: "film/intermission-time",
  title: "Intermission Time",
  description:
    "Intermission duration from the program-minute offset at pause and at resumption.",
  inputs: [
    {
      id: "pauseAtMinute",
      kind: "number",
      label: "Pause At Minute",
      unit: "min",
      minimum: 0,
    },
    {
      id: "resumeAtMinute",
      kind: "number",
      label: "Resume At Minute",
      unit: "min",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "intermissionMinutes",
      kind: "number",
      label: "Intermission Minutes",
      unit: "min",
    },
  ],
  calculate: (input) =>
    calculateIntermissionTime({
      pauseAtMinute: input.pauseAtMinute as number,
      resumeAtMinute: input.resumeAtMinute as number,
    }),
});
export const intermissionTimeTool = tool;
export const runIntermissionTime = tool.execute;
export default tool;
