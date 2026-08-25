import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type CorkSoakPlannerInput = {
  readonly batchCount: number;
  readonly soakMinutesPerBatch: number;
};

export type CorkSoakPlannerOutput = {
  readonly totalSoakMinutes: number;
};

export const corkSoakPlannerExample = {
  input: {
    batchCount: 3,
    soakMinutesPerBatch: 10,
  },
  output: {
    totalSoakMinutes: 30,
  },
} satisfies ToolExample<CorkSoakPlannerInput, CorkSoakPlannerOutput>;

export const calculateCorkSoak = (
  input: CorkSoakPlannerInput,
): CorkSoakPlannerOutput => {
  return {
    totalSoakMinutes: input.batchCount * input.soakMinutesPerBatch,
  };
};

export const corkSoakPlannerTool = createSimpleTool({
  calculate: (input) =>
    calculateCorkSoak(input as unknown as CorkSoakPlannerInput),
  description:
    "Calculate total sequential processing time when a closure supplier explicitly requires cork preparation in multiple batches; use the supplier's instructions because many modern closures must not be soaked.",
  id: "oenology/cork-soak-planner",
  inputs: [
    {
      description: "Closure batches processed sequentially.",
      id: "batchCount",
      kind: "integer",
      label: "Batch count",
      minimum: 0,
    },
    {
      description: "Supplier-specified preparation time for each batch.",
      id: "soakMinutesPerBatch",
      kind: "number",
      label: "Minutes per batch",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Total time for sequential batches.",
      id: "totalSoakMinutes",
      kind: "number",
      label: "Soak time",
      unit: "min",
    },
  ],
  title: "Cork Preparation Batch Time Planner",
});
export const runCorkSoakPlanner = corkSoakPlannerTool.execute;
export default corkSoakPlannerTool;
