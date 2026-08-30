import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FeFetMemoryWindowInput = Readonly<{
  readonly programThresholdVolts: number;
  readonly eraseThresholdVolts: number;
}>;
export type FeFetMemoryWindowOutput = Readonly<{
  readonly windowVolts: number;
}>;

export const calculateFeFetMemoryWindow = (
  x: FeFetMemoryWindowInput,
): FeFetMemoryWindowOutput => {
  if (!Number.isFinite(x.programThresholdVolts))
    simpleError("programThresholdVolts", "Provide a finite number.");
  if (!Number.isFinite(x.eraseThresholdVolts))
    simpleError("eraseThresholdVolts", "Provide a finite number.");
  const windowVolts = Math.abs(x.programThresholdVolts - x.eraseThresholdVolts);
  if (!Number.isFinite(windowVolts))
    simpleError(
      "windowVolts",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { windowVolts: Object.is(windowVolts, -0) ? 0 : windowVolts };
};

export const example = {
  input: { programThresholdVolts: 2, eraseThresholdVolts: -1 },
  output: { windowVolts: 3 },
} satisfies ToolExample<FeFetMemoryWindowInput, FeFetMemoryWindowOutput>;

export const tool = createSimpleTool({
  id: "semiconductor/fe-fet-memory-window",
  title: "Fe Fet Memory Window",
  description:
    "FeFET threshold-voltage memory window as the absolute difference between programmed and erased thresholds.",
  inputs: [
    {
      id: "programThresholdVolts",
      kind: "number",
      label: "Program Threshold Volts",
      unit: "V",
    },
    {
      id: "eraseThresholdVolts",
      kind: "number",
      label: "Erase Threshold Volts",
      unit: "V",
    },
  ],
  outputs: [
    { id: "windowVolts", kind: "number", label: "Window Volts", unit: "V" },
  ],
  calculate: (input) =>
    calculateFeFetMemoryWindow({
      programThresholdVolts: input.programThresholdVolts as number,
      eraseThresholdVolts: input.eraseThresholdVolts as number,
    }),
});
export const feFetMemoryWindowTool = tool;
export const runFeFetMemoryWindow = tool.execute;
export default tool;
