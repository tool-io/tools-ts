import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly requestedDelayFemtoseconds: number;
  readonly stageStepNanometers: number;
}>;
export type Output = Readonly<{
  readonly requiredDisplacementMicrometers: number;
  readonly nearestStepCount: number;
  readonly achievedDelayFemtoseconds: number;
  readonly delayErrorFemtoseconds: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.stageStepNanometers <= 0)
    simpleError(
      "stageStepNanometers",
      "Stage step size must be positive.",
      "invalid_step",
    );
  const requiredDisplacementMicrometers =
    ((299792458 * input.requestedDelayFemtoseconds * 1e-15) / 2) * 1e6;
  const nearestStepCount = Math.round(
    (requiredDisplacementMicrometers * 1000) / input.stageStepNanometers,
  );
  const achievedDelayFemtoseconds =
    ((2 * nearestStepCount * input.stageStepNanometers * 1e-9) / 299792458) *
    1e15;
  return {
    requiredDisplacementMicrometers,
    nearestStepCount,
    achievedDelayFemtoseconds,
    delayErrorFemtoseconds:
      achievedDelayFemtoseconds - input.requestedDelayFemtoseconds,
  };
};

export const exampleInput = {
  requestedDelayFemtoseconds: 2000,
  stageStepNanometers: 100,
} satisfies Input;
export const exampleOutput = {
  requiredDisplacementMicrometers: 299.792458,
  nearestStepCount: 2998,
  achievedDelayFemtoseconds: 2000.0503148081198,
  delayErrorFemtoseconds: 0.050314808119765075,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      requestedDelayFemtoseconds: input.requestedDelayFemtoseconds as number,
      stageStepNanometers: input.stageStepNanometers as number,
    }),
  description:
    "Convert pump–probe delay to retroreflector displacement and quantized stage steps.",
  id: "laser/pump-probe-delay-stage",
  inputs: [
    {
      id: "requestedDelayFemtoseconds",
      label: "Requested optical delay",
      kind: "number",
      unit: "fs",
    },
    {
      id: "stageStepNanometers",
      label: "Stage step size",
      kind: "number",
      minimum: 0,
      unit: "nm",
    },
  ],
  outputs: [
    {
      id: "requiredDisplacementMicrometers",
      label: "Retroreflector displacement",
      kind: "number",
      unit: "µm",
    },
    {
      id: "nearestStepCount",
      label: "Nearest stage-step count",
      kind: "integer",
    },
    {
      id: "achievedDelayFemtoseconds",
      label: "Achieved optical delay",
      kind: "number",
      unit: "fs",
    },
    {
      id: "delayErrorFemtoseconds",
      label: "Delay quantization error",
      kind: "number",
      unit: "fs",
    },
  ],
  title: "Pump\u2013Probe Delay Stage",
});

export const run = tool.execute;
export default tool;
