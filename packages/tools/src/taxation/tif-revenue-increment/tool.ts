import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly currentAssessedValue: number;
  readonly baseAssessedValue: number;
  readonly taxRatePercent: number;
  readonly capturePercent: number;
}>;
export type Output = Readonly<{
  readonly assessedValueIncrement: number;
  readonly grossIncrementalRevenue: number;
  readonly capturedTifRevenue: number;
}>;

export const calculate = (input: Input): Output => {
  const assessedValueIncrement = Math.max(
    0,
    input.currentAssessedValue - input.baseAssessedValue,
  );
  const grossIncrementalRevenue =
    (assessedValueIncrement * input.taxRatePercent) / 100;
  return {
    assessedValueIncrement,
    grossIncrementalRevenue,
    capturedTifRevenue: (grossIncrementalRevenue * input.capturePercent) / 100,
  };
};

export const exampleInput = {
  currentAssessedValue: 150000,
  baseAssessedValue: 100000,
  taxRatePercent: 2,
  capturePercent: 80,
} satisfies Input;
export const exampleOutput = {
  assessedValueIncrement: 50000,
  grossIncrementalRevenue: 1000,
  capturedTifRevenue: 800,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      currentAssessedValue: input.currentAssessedValue as number,
      baseAssessedValue: input.baseAssessedValue as number,
      taxRatePercent: input.taxRatePercent as number,
      capturePercent: input.capturePercent as number,
    }),
  description:
    "Calculate captured tax-increment revenue from caller-supplied values and rates.",
  id: "taxation/tif-revenue-increment",
  inputs: [
    {
      id: "currentAssessedValue",
      label: "Current assessed value",
      kind: "number",
      minimum: 0,
    },
    {
      id: "baseAssessedValue",
      label: "Base assessed value",
      kind: "number",
      minimum: 0,
    },
    {
      id: "taxRatePercent",
      label: "Applicable tax rate",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      id: "capturePercent",
      label: "Increment capture rate",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "assessedValueIncrement",
      label: "Assessed-value increment",
      kind: "number",
      minimum: 0,
    },
    {
      id: "grossIncrementalRevenue",
      label: "Gross incremental revenue",
      kind: "number",
      minimum: 0,
    },
    {
      id: "capturedTifRevenue",
      label: "Captured TIF revenue",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "TIF Revenue Increment",
});

export const run = tool.execute;
export default tool;
