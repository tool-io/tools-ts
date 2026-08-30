import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ChopperAmplifierOffsetInput = Readonly<{
  readonly outputOffsetMillivolts: number;
  readonly closedLoopGain: number;
}>;
export type ChopperAmplifierOffsetOutput = Readonly<{
  readonly inputOffsetMillivolts: number;
}>;

export const calculateChopperAmplifierOffset = (
  x: ChopperAmplifierOffsetInput,
): ChopperAmplifierOffsetOutput => {
  if (!Number.isFinite(x.outputOffsetMillivolts))
    simpleError("outputOffsetMillivolts", "Provide a finite number.");
  if (!Number.isFinite(x.closedLoopGain) || x.closedLoopGain < 0)
    simpleError("closedLoopGain", "Provide a finite number at least 0.");
  const inputOffsetMillivolts = x.outputOffsetMillivolts / x.closedLoopGain;
  if (!Number.isFinite(inputOffsetMillivolts))
    simpleError(
      "inputOffsetMillivolts",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    inputOffsetMillivolts: Object.is(inputOffsetMillivolts, -0)
      ? 0
      : inputOffsetMillivolts,
  };
};

export const example = {
  input: { outputOffsetMillivolts: 2, closedLoopGain: 100 },
  output: { inputOffsetMillivolts: 0.02 },
} satisfies ToolExample<
  ChopperAmplifierOffsetInput,
  ChopperAmplifierOffsetOutput
>;

export const tool = createSimpleTool({
  id: "electronics/chopper-amplifier-offset",
  title: "Chopper Amplifier Offset",
  description:
    "Input-referred residual DC offset of a chopper amplifier from its zero-input output offset and closed-loop voltage gain.",
  inputs: [
    {
      id: "outputOffsetMillivolts",
      kind: "number",
      label: "Output Offset Millivolts",
      unit: "mV",
    },
    {
      id: "closedLoopGain",
      kind: "number",
      label: "Closed Loop Gain",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "inputOffsetMillivolts",
      kind: "number",
      label: "Input Offset Millivolts",
      unit: "mV",
    },
  ],
  calculate: (input) =>
    calculateChopperAmplifierOffset({
      outputOffsetMillivolts: input.outputOffsetMillivolts as number,
      closedLoopGain: input.closedLoopGain as number,
    }),
});
export const chopperAmplifierOffsetTool = tool;
export const runChopperAmplifierOffset = tool.execute;
export default tool;
