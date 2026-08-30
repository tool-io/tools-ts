import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly originalPlannedHours: number;
  readonly revisedPlannedHours: number;
  readonly addedRiskCount: number;
  readonly removedRiskCount: number;
  readonly documentedChangeCount: number;
}>;
export type Output = Readonly<{
  readonly hourChange: number;
  readonly hourChangePercent: number;
  readonly netRiskChange: number;
  readonly changeLogComplete: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (input.originalPlannedHours <= 0)
    simpleError(
      "originalPlannedHours",
      "Original planned hours must be positive.",
      "invalid_baseline",
    );
  const requiredChanges = input.addedRiskCount + input.removedRiskCount;
  return {
    hourChange: input.revisedPlannedHours - input.originalPlannedHours,
    hourChangePercent:
      (input.revisedPlannedHours / input.originalPlannedHours - 1) * 100,
    netRiskChange: input.addedRiskCount - input.removedRiskCount,
    changeLogComplete: input.documentedChangeCount >= requiredChanges,
  };
};

export const exampleInput = {
  originalPlannedHours: 100,
  revisedPlannedHours: 120,
  addedRiskCount: 2,
  removedRiskCount: 1,
  documentedChangeCount: 3,
} satisfies Input;
export const exampleOutput = {
  hourChange: 20,
  hourChangePercent: 19.999999999999996,
  netRiskChange: 1,
  changeLogComplete: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      originalPlannedHours: input.originalPlannedHours as number,
      revisedPlannedHours: input.revisedPlannedHours as number,
      addedRiskCount: input.addedRiskCount as number,
      removedRiskCount: input.removedRiskCount as number,
      documentedChangeCount: input.documentedChangeCount as number,
    }),
  description: "Quantify audit rescoping changes and change-log completeness.",
  id: "auditing/rescope-change-log",
  inputs: [
    {
      id: "originalPlannedHours",
      label: "Original planned hours",
      kind: "number",
      minimum: 0,
      unit: "h",
    },
    {
      id: "revisedPlannedHours",
      label: "Revised planned hours",
      kind: "number",
      minimum: 0,
      unit: "h",
    },
    { id: "addedRiskCount", label: "Added risks", kind: "integer", minimum: 0 },
    {
      id: "removedRiskCount",
      label: "Removed risks",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "documentedChangeCount",
      label: "Documented scope changes",
      kind: "integer",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "hourChange",
      label: "Planned-hour change",
      kind: "number",
      unit: "h",
    },
    {
      id: "hourChangePercent",
      label: "Planned-hour change",
      kind: "number",
      unit: "%",
    },
    { id: "netRiskChange", label: "Net risk change", kind: "integer" },
    { id: "changeLogComplete", label: "Changes documented", kind: "boolean" },
  ],
  title: "Rescope Change Log",
});

export const run = tool.execute;
export default tool;
