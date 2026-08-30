import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly receivedAt: string;
  readonly respondedAt: string;
  readonly slaHours: number;
}>;
export type Output = Readonly<{
  readonly elapsedHours: number;
  readonly slaMarginHours: number;
  readonly metSla: boolean;
}>;

export const calculate = (input: Input): Output => {
  const start = new Date(input.receivedAt),
    end = new Date(input.respondedAt);
  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime()) ||
    end < start
  )
    simpleError(
      "respondedAt",
      "Timestamps must be valid and ordered.",
      "invalid_timestamps",
    );
  const elapsedHours = (end.getTime() - start.getTime()) / 3600000;
  return {
    elapsedHours,
    slaMarginHours: input.slaHours - elapsedHours,
    metSla: elapsedHours <= input.slaHours,
  };
};

export const exampleInput = {
  receivedAt: "2025-01-01T00:00:00Z",
  respondedAt: "2025-01-02T12:00:00Z",
  slaHours: 48,
} satisfies Input;
export const exampleOutput = {
  elapsedHours: 36,
  slaMarginHours: 12,
  metSla: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      receivedAt: input.receivedAt as string,
      respondedAt: input.respondedAt as string,
      slaHours: input.slaHours as number,
    }),
  description:
    "Measure a records-request response against a caller-supplied SLA.",
  id: "journalism/records-request-sla",
  inputs: [
    { id: "receivedAt", label: "Request received timestamp", kind: "string" },
    { id: "respondedAt", label: "Response timestamp", kind: "string" },
    {
      id: "slaHours",
      label: "Response SLA",
      kind: "number",
      minimum: 0,
      unit: "h",
    },
  ],
  outputs: [
    {
      id: "elapsedHours",
      label: "Elapsed response time",
      kind: "number",
      minimum: 0,
      unit: "h",
    },
    {
      id: "slaMarginHours",
      label: "SLA time remaining",
      kind: "number",
      unit: "h",
    },
    { id: "metSla", label: "Met supplied SLA", kind: "boolean" },
  ],
  title: "Records Request SLA",
});

export const run = tool.execute;
export default tool;
