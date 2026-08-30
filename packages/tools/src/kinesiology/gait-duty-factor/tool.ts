import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly stanceSeconds: number;
  readonly gaitCycleSeconds: number;
  readonly walkingDutyCutoff: number;
}>;
export type Output = Readonly<{
  readonly dutyFactor: number;
  readonly stancePercent: number;
  readonly aboveWalkingCutoff: boolean;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.stanceSeconds < 0 ||
    input.gaitCycleSeconds <= 0 ||
    input.stanceSeconds > input.gaitCycleSeconds ||
    input.walkingDutyCutoff < 0 ||
    input.walkingDutyCutoff > 1
  )
    simpleError(
      "stanceSeconds",
      "Stance must fit within gait cycle and cutoff must lie in [0,1].",
    );
  const dutyFactor = input.stanceSeconds / input.gaitCycleSeconds;
  return {
    dutyFactor,
    stancePercent: 100 * dutyFactor,
    aboveWalkingCutoff: dutyFactor >= input.walkingDutyCutoff,
  };
};
export const exampleInput = {
  stanceSeconds: 0.6,
  gaitCycleSeconds: 1,
  walkingDutyCutoff: 0.5,
} satisfies Input;
export const exampleOutput = {
  dutyFactor: 0.6,
  stancePercent: 60,
  aboveWalkingCutoff: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/gait-duty-factor",
  title: "Gait Duty Factor",
  description:
    "Calculate stance duty factor and compare against a supplied walking cutoff.",
  inputs: [
    { id: "stanceSeconds", label: "Stance seconds", kind: "number" },
    { id: "gaitCycleSeconds", label: "Gait cycle seconds", kind: "number" },
    { id: "walkingDutyCutoff", label: "Walking duty cutoff", kind: "number" },
  ],
  outputs: [
    { id: "dutyFactor", label: "Duty factor", kind: "number" },
    { id: "stancePercent", label: "Stance percent", kind: "number" },
    {
      id: "aboveWalkingCutoff",
      label: "Above walking cutoff",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      stanceSeconds: value.stanceSeconds as number,
      gaitCycleSeconds: value.gaitCycleSeconds as number,
      walkingDutyCutoff: value.walkingDutyCutoff as number,
    }),
});
export const run = tool.execute;
export default tool;
