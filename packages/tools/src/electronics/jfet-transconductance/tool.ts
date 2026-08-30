import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type JfetTransconductanceInput = Readonly<{
  readonly zeroBiasTransconductanceS: number;
  readonly gateSourceVoltageV: number;
  readonly pinchOffVoltageV: number;
}>;
export type JfetTransconductanceOutput = Readonly<{
  readonly transconductanceS: number;
}>;

export const calculateJfetTransconductance = (
  x: JfetTransconductanceInput,
): JfetTransconductanceOutput => {
  if (
    !Number.isFinite(x.zeroBiasTransconductanceS) ||
    x.zeroBiasTransconductanceS < 0
  )
    simpleError(
      "zeroBiasTransconductanceS",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.gateSourceVoltageV))
    simpleError("gateSourceVoltageV", "Provide a finite number.");
  if (!Number.isFinite(x.pinchOffVoltageV))
    simpleError("pinchOffVoltageV", "Provide a finite number.");
  if (!(
    x.pinchOffVoltageV < 0 &&
    x.gateSourceVoltageV >= x.pinchOffVoltageV &&
    x.gateSourceVoltageV <= 0
  ))
    simpleError(
      "gateSourceVoltageV",
      "Gate bias must lie between negative pinch-off and zero.",
    );
  const transconductanceS =
    x.zeroBiasTransconductanceS *
    (1 - x.gateSourceVoltageV / x.pinchOffVoltageV);
  if (!Number.isFinite(transconductanceS))
    simpleError("transconductanceS", "The inputs produce an invalid result.");
  return {
    transconductanceS: Object.is(transconductanceS, -0) ? 0 : transconductanceS,
  };
};

export const example = {
  input: {
    zeroBiasTransconductanceS: 0.01,
    gateSourceVoltageV: -2,
    pinchOffVoltageV: -4,
  },
  output: { transconductanceS: 0.005 },
} satisfies ToolExample<JfetTransconductanceInput, JfetTransconductanceOutput>;

export const tool = createSimpleTool({
  id: "electronics/jfet-transconductance",
  title: "JFET Transconductance",
  description:
    "Estimate n-channel JFET transconductance with Shockley's square-law model for gate bias between negative pinch-off and zero.",
  inputs: [
    {
      id: "zeroBiasTransconductanceS",
      kind: "number",
      label: "Transconductance at zero gate bias",
      unit: "S",
      minimum: 0,
    },
    {
      id: "gateSourceVoltageV",
      kind: "number",
      label: "Gate-source voltage",
      unit: "V",
    },
    {
      id: "pinchOffVoltageV",
      kind: "number",
      label: "Negative pinch-off voltage",
      unit: "V",
    },
  ],
  outputs: [
    {
      id: "transconductanceS",
      kind: "number",
      label: "Biased transconductance",
      unit: "S",
    },
  ],
  calculate: (input) =>
    calculateJfetTransconductance({
      zeroBiasTransconductanceS: input.zeroBiasTransconductanceS as number,
      gateSourceVoltageV: input.gateSourceVoltageV as number,
      pinchOffVoltageV: input.pinchOffVoltageV as number,
    }),
});
export const jfetTransconductanceTool = tool;
export const runJfetTransconductance = tool.execute;
export default tool;
