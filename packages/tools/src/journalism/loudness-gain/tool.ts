import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly measuredLufs: number;
  readonly targetLufs: number;
  readonly currentTruePeakDbtp: number;
  readonly maximumTruePeakDbtp: number;
}>;
export type Output = Readonly<{
  readonly gainAdjustmentDb: number;
  readonly projectedTruePeakDbtp: number;
  readonly peakWithinLimit: boolean;
}>;

export const calculate = (input: Input): Output => {
  const gainAdjustmentDb = input.targetLufs - input.measuredLufs;
  const projectedTruePeakDbtp = input.currentTruePeakDbtp + gainAdjustmentDb;
  return {
    gainAdjustmentDb,
    projectedTruePeakDbtp,
    peakWithinLimit: projectedTruePeakDbtp <= input.maximumTruePeakDbtp,
  };
};

export const exampleInput = {
  measuredLufs: -20,
  targetLufs: -16,
  currentTruePeakDbtp: -6,
  maximumTruePeakDbtp: -1,
} satisfies Input;
export const exampleOutput = {
  gainAdjustmentDb: 4,
  projectedTruePeakDbtp: -2,
  peakWithinLimit: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      measuredLufs: input.measuredLufs as number,
      targetLufs: input.targetLufs as number,
      currentTruePeakDbtp: input.currentTruePeakDbtp as number,
      maximumTruePeakDbtp: input.maximumTruePeakDbtp as number,
    }),
  description: "Calculate loudness gain and projected true peak.",
  id: "journalism/loudness-gain",
  inputs: [
    {
      id: "measuredLufs",
      label: "Measured integrated loudness",
      kind: "number",
      unit: "LUFS",
    },
    {
      id: "targetLufs",
      label: "Target integrated loudness",
      kind: "number",
      unit: "LUFS",
    },
    {
      id: "currentTruePeakDbtp",
      label: "Current true peak",
      kind: "number",
      unit: "dBTP",
    },
    {
      id: "maximumTruePeakDbtp",
      label: "Maximum true peak",
      kind: "number",
      unit: "dBTP",
    },
  ],
  outputs: [
    {
      id: "gainAdjustmentDb",
      label: "Required gain adjustment",
      kind: "number",
      unit: "dB",
    },
    {
      id: "projectedTruePeakDbtp",
      label: "Projected true peak",
      kind: "number",
      unit: "dBTP",
    },
    {
      id: "peakWithinLimit",
      label: "Projected peak within limit",
      kind: "boolean",
    },
  ],
  title: "Loudness Gain",
});

export const run = tool.execute;
export default tool;
