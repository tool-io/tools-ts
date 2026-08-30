import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly terahertzPhaseIndex: number;
  readonly opticalGroupIndex: number;
}>;
export type Output = Readonly<{
  readonly cherenkovAngleDegrees: number;
  readonly phaseMatched: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (input.opticalGroupIndex <= 0)
    simpleError(
      "opticalGroupIndex",
      "Optical group index must be positive.",
      "invalid_index",
    );
  const ratio = input.terahertzPhaseIndex / input.opticalGroupIndex;
  if (ratio > 1) return { cherenkovAngleDegrees: 0, phaseMatched: false };
  return {
    cherenkovAngleDegrees: (Math.acos(ratio) * 180) / Math.PI,
    phaseMatched: true,
  };
};

export const exampleInput = {
  terahertzPhaseIndex: 1,
  opticalGroupIndex: 2,
} satisfies Input;
export const exampleOutput = {
  cherenkovAngleDegrees: 60.00000000000001,
  phaseMatched: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      terahertzPhaseIndex: input.terahertzPhaseIndex as number,
      opticalGroupIndex: input.opticalGroupIndex as number,
    }),
  description:
    "Calculate a Cherenkov outcoupling angle from THz phase and optical group indices.",
  id: "laser/cherenkov-outcoupling-angle",
  inputs: [
    {
      id: "terahertzPhaseIndex",
      label: "THz phase index",
      kind: "number",
      minimum: 0,
    },
    {
      id: "opticalGroupIndex",
      label: "Optical group index",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "cherenkovAngleDegrees",
      label: "Cherenkov outcoupling angle",
      kind: "number",
      minimum: 0,
      maximum: 90,
      unit: "°",
    },
    {
      id: "phaseMatched",
      label: "Physical phase-matched angle",
      kind: "boolean",
    },
  ],
  title: "Cherenkov Outcoupling Angle",
});

export const run = tool.execute;
export default tool;
