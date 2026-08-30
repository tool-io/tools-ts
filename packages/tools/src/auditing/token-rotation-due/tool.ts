import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly lastRotationDate: string;
  readonly rotationIntervalDays: number;
  readonly asOfDate: string;
}>;
export type Output = Readonly<{
  readonly nextRotationDate: string;
  readonly daysUntilRotation: number;
  readonly rotationOverdue: boolean;
}>;

export const calculate = (input: Input): Output => {
  const last = new Date(`${input.lastRotationDate}T00:00:00Z`),
    asOf = new Date(`${input.asOfDate}T00:00:00Z`);
  if (Number.isNaN(last.getTime()) || Number.isNaN(asOf.getTime()))
    simpleError("lastRotationDate", "Dates must be valid.", "invalid_dates");
  const next = new Date(last);
  next.setUTCDate(next.getUTCDate() + input.rotationIntervalDays);
  const daysUntilRotation = Math.ceil(
    (next.getTime() - asOf.getTime()) / 86400000,
  );
  return {
    nextRotationDate: next.toISOString().slice(0, 10),
    daysUntilRotation,
    rotationOverdue: daysUntilRotation < 0,
  };
};

export const exampleInput = {
  lastRotationDate: "2025-01-01",
  rotationIntervalDays: 90,
  asOfDate: "2025-03-01",
} satisfies Input;
export const exampleOutput = {
  nextRotationDate: "2025-04-01",
  daysUntilRotation: 31,
  rotationOverdue: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      lastRotationDate: input.lastRotationDate as string,
      rotationIntervalDays: input.rotationIntervalDays as number,
      asOfDate: input.asOfDate as string,
    }),
  description: "Calculate API token rotation due date and overdue status.",
  id: "auditing/token-rotation-due",
  inputs: [
    {
      id: "lastRotationDate",
      label: "Last token rotation date",
      kind: "string",
    },
    {
      id: "rotationIntervalDays",
      label: "Rotation interval",
      kind: "integer",
      minimum: 1,
      unit: "days",
    },
    { id: "asOfDate", label: "As-of date", kind: "string" },
  ],
  outputs: [
    { id: "nextRotationDate", label: "Next rotation date", kind: "string" },
    { id: "daysUntilRotation", label: "Days until rotation", kind: "integer" },
    { id: "rotationOverdue", label: "Rotation is overdue", kind: "boolean" },
  ],
  title: "Token Rotation Due",
});

export const run = tool.execute;
export default tool;
