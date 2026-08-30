import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly currentCadenceSpm: number;
  readonly plannedIncreasePercent: number;
}>;
export type Output = Readonly<{
  readonly targetCadenceSpm: number;
  readonly cadenceDeltaSpm: number;
  readonly stepLengthFactorAtFixedSpeed: number;
}>;
export const calculate = (input: Input): Output => {
  if (input.currentCadenceSpm <= 0 || input.plannedIncreasePercent < 0)
    simpleError(
      "currentCadenceSpm",
      "Positive cadence and nonnegative planned increase required.",
    );
  const targetCadenceSpm =
    input.currentCadenceSpm * (1 + input.plannedIncreasePercent / 100);
  return {
    targetCadenceSpm,
    cadenceDeltaSpm: targetCadenceSpm - input.currentCadenceSpm,
    stepLengthFactorAtFixedSpeed: input.currentCadenceSpm / targetCadenceSpm,
  };
};
export const exampleInput = {
  currentCadenceSpm: 160,
  plannedIncreasePercent: 5,
} satisfies Input;
export const exampleOutput = {
  targetCadenceSpm: 168,
  cadenceDeltaSpm: 8,
  stepLengthFactorAtFixedSpeed: 0.9523809523809523,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/cadence-change-prescription",
  title: "Cadence Change Prescription",
  description:
    "Translate a planned cadence increase into target steps/min and step-length factor.",
  inputs: [
    { id: "currentCadenceSpm", label: "Current cadence spm", kind: "number" },
    {
      id: "plannedIncreasePercent",
      label: "Planned increase percent",
      kind: "number",
    },
  ],
  outputs: [
    { id: "targetCadenceSpm", label: "Target cadence spm", kind: "number" },
    { id: "cadenceDeltaSpm", label: "Cadence delta spm", kind: "number" },
    {
      id: "stepLengthFactorAtFixedSpeed",
      label: "Step length factor at fixed speed",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      currentCadenceSpm: value.currentCadenceSpm as number,
      plannedIncreasePercent: value.plannedIncreasePercent as number,
    }),
});
export const run = tool.execute;
export default tool;
