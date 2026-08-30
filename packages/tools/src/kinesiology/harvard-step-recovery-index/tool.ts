import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly exerciseSeconds: number;
  readonly recoveryPulseCounts: readonly number[];
}>;
export type Output = Readonly<{
  readonly recoveryIndex: number;
  readonly pulseCountTotal: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.exerciseSeconds <= 0 ||
    input.recoveryPulseCounts.length !== 3 ||
    input.recoveryPulseCounts.some((v) => !Number.isSafeInteger(v) || v <= 0)
  )
    simpleError(
      "recoveryPulseCounts",
      "Three positive 30-second recovery pulse counts required.",
    );
  const pulseCountTotal = input.recoveryPulseCounts.reduce((a, b) => a + b, 0);
  return {
    recoveryIndex: (100 * input.exerciseSeconds) / (2 * pulseCountTotal),
    pulseCountTotal,
  };
};
export const exampleInput = {
  exerciseSeconds: 300,
  recoveryPulseCounts: [50, 50, 50],
} satisfies Input;
export const exampleOutput = {
  recoveryIndex: 100,
  pulseCountTotal: 150,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/harvard-step-recovery-index",
  title: "Harvard Step Recovery Index",
  description:
    "Calculate the Harvard step-test index from exercise duration and three recovery pulse counts.",
  inputs: [
    { id: "exerciseSeconds", label: "Exercise seconds", kind: "number" },
    {
      id: "recoveryPulseCounts",
      label: "Recovery pulse counts",
      kind: "numberList",
    },
  ],
  outputs: [
    { id: "recoveryIndex", label: "Recovery index", kind: "number" },
    { id: "pulseCountTotal", label: "Pulse count total", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      exerciseSeconds: value.exerciseSeconds as number,
      recoveryPulseCounts: value.recoveryPulseCounts as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
