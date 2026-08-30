import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly positiveDwellMs: number;
  readonly negativeDwellMs: number;
  readonly switchingOverheadMs: number;
}>;
export type Output = Readonly<{
  readonly cycleMs: number;
  readonly positiveDutyPercent: number;
  readonly negativeDutyPercent: number;
  readonly overheadPercent: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    Math.min(
      input.positiveDwellMs,
      input.negativeDwellMs,
      input.switchingOverheadMs,
    ) < 0
  )
    simpleError(
      "positiveDwellMs",
      "Dwell and overhead times must be nonnegative.",
    );
  const cycleMs =
    input.positiveDwellMs + input.negativeDwellMs + input.switchingOverheadMs;
  if (cycleMs <= 0)
    simpleError("positiveDwellMs", "Total cycle must be positive.");
  return {
    cycleMs,
    positiveDutyPercent: (input.positiveDwellMs / cycleMs) * 100,
    negativeDutyPercent: (input.negativeDwellMs / cycleMs) * 100,
    overheadPercent: (input.switchingOverheadMs / cycleMs) * 100,
  };
};
export const exampleInput = {
  positiveDwellMs: 50,
  negativeDwellMs: 30,
  switchingOverheadMs: 20,
} satisfies Input;
export const exampleOutput = {
  cycleMs: 100,
  positiveDutyPercent: 50,
  negativeDutyPercent: 30,
  overheadPercent: 20,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/polarity-duty-cycle",
  title: "Polarity Duty Cycle",
  description:
    "Break down positive/negative ionization duty cycle and switching overhead.",
  inputs: [
    { id: "positiveDwellMs", kind: "number", label: "Positive dwell ms" },
    { id: "negativeDwellMs", kind: "number", label: "Negative dwell ms" },
    {
      id: "switchingOverheadMs",
      kind: "number",
      label: "Switching overhead ms",
    },
  ],
  outputs: [
    { id: "cycleMs", kind: "number", label: "Cycle ms" },
    {
      id: "positiveDutyPercent",
      kind: "number",
      label: "Positive duty percent",
    },
    {
      id: "negativeDutyPercent",
      kind: "number",
      label: "Negative duty percent",
    },
    { id: "overheadPercent", kind: "number", label: "Overhead percent" },
  ],
  calculate: (value) =>
    calculate({
      positiveDwellMs: value.positiveDwellMs as number,
      negativeDwellMs: value.negativeDwellMs as number,
      switchingOverheadMs: value.switchingOverheadMs as number,
    }),
});
export const run = tool.execute;
export default tool;
