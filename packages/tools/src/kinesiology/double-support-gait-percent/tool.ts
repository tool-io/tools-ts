import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly doubleSupportSeconds: number;
  readonly gaitCycleSeconds: number;
}>;
export type Output = Readonly<{
  readonly doubleSupportPercent: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.doubleSupportSeconds < 0 ||
    input.gaitCycleSeconds <= 0 ||
    input.doubleSupportSeconds > input.gaitCycleSeconds
  )
    simpleError(
      "gaitCycleSeconds",
      "Double-support time must fit within a positive gait cycle.",
    );
  return {
    doubleSupportPercent:
      (100 * input.doubleSupportSeconds) / input.gaitCycleSeconds,
  };
};
export const exampleInput = {
  doubleSupportSeconds: 0.2,
  gaitCycleSeconds: 1,
} satisfies Input;
export const exampleOutput = { doubleSupportPercent: 20 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/double-support-gait-percent",
  title: "Double Support Gait Percent",
  description: "Measure fraction of a gait cycle with both feet on the ground.",
  inputs: [
    {
      id: "doubleSupportSeconds",
      label: "Double support seconds",
      kind: "number",
    },
    { id: "gaitCycleSeconds", label: "Gait cycle seconds", kind: "number" },
  ],
  outputs: [
    {
      id: "doubleSupportPercent",
      label: "Double support percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      doubleSupportSeconds: value.doubleSupportSeconds as number,
      gaitCycleSeconds: value.gaitCycleSeconds as number,
    }),
});
export const run = tool.execute;
export default tool;
