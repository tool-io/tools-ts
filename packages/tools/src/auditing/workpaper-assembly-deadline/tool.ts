import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly reportReleaseDate: string;
  readonly assemblyWindowDays: number;
  readonly assemblyCompletedDate: string;
}>;
export type Output = Readonly<{
  readonly assemblyDeadline: string;
  readonly elapsedDays: number;
  readonly daysLate: number;
  readonly onTime: boolean;
}>;

export const calculate = (input: Input): Output => {
  const release = new Date(`${input.reportReleaseDate}T00:00:00Z`),
    completed = new Date(`${input.assemblyCompletedDate}T00:00:00Z`);
  if (
    Number.isNaN(release.getTime()) ||
    Number.isNaN(completed.getTime()) ||
    completed < release
  )
    simpleError(
      "assemblyCompletedDate",
      "Dates must be valid and ordered.",
      "invalid_dates",
    );
  const deadline = new Date(release);
  deadline.setUTCDate(deadline.getUTCDate() + input.assemblyWindowDays);
  const elapsedDays = Math.floor(
      (completed.getTime() - release.getTime()) / 86400000,
    ),
    daysLate = Math.max(0, elapsedDays - input.assemblyWindowDays);
  return {
    assemblyDeadline: deadline.toISOString().slice(0, 10),
    elapsedDays,
    daysLate,
    onTime: daysLate === 0,
  };
};

export const exampleInput = {
  reportReleaseDate: "2025-01-01",
  assemblyWindowDays: 60,
  assemblyCompletedDate: "2025-02-20",
} satisfies Input;
export const exampleOutput = {
  assemblyDeadline: "2025-03-02",
  elapsedDays: 50,
  daysLate: 0,
  onTime: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      reportReleaseDate: input.reportReleaseDate as string,
      assemblyWindowDays: input.assemblyWindowDays as number,
      assemblyCompletedDate: input.assemblyCompletedDate as string,
    }),
  description:
    "Check workpaper assembly completion against a supplied deadline window.",
  id: "auditing/workpaper-assembly-deadline",
  inputs: [
    { id: "reportReleaseDate", label: "Report release date", kind: "string" },
    {
      id: "assemblyWindowDays",
      label: "Assembly window",
      kind: "integer",
      minimum: 0,
      unit: "days",
    },
    {
      id: "assemblyCompletedDate",
      label: "Assembly completed date",
      kind: "string",
    },
  ],
  outputs: [
    { id: "assemblyDeadline", label: "Assembly deadline", kind: "string" },
    {
      id: "elapsedDays",
      label: "Elapsed assembly days",
      kind: "integer",
      minimum: 0,
    },
    { id: "daysLate", label: "Days late", kind: "integer", minimum: 0 },
    { id: "onTime", label: "Assembly completed on time", kind: "boolean" },
  ],
  title: "Workpaper Assembly Deadline",
});

export const run = tool.execute;
export default tool;
