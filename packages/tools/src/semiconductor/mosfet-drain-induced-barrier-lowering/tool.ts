import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DiblInput = {
  readonly drainVoltageChangeV: number;
  readonly thresholdShiftMagnitudeMv: number;
};

export type DiblOutput = {
  readonly diblCoefficientMVPerV: number;
};

export const diblExample = {
  input: { drainVoltageChangeV: 1, thresholdShiftMagnitudeMv: 50 },
  output: { diblCoefficientMVPerV: 50 },
} satisfies ToolExample<DiblInput, DiblOutput>;

export const calculateDibl = (input: DiblInput): DiblOutput => {
  if (
    !Number.isFinite(input.drainVoltageChangeV) ||
    input.drainVoltageChangeV <= 0
  )
    simpleError(
      "drainVoltageChangeV",
      "The drain-voltage change must be positive.",
      "invalid_drain_voltage",
    );
  if (
    !Number.isFinite(input.thresholdShiftMagnitudeMv) ||
    input.thresholdShiftMagnitudeMv < 0
  )
    simpleError(
      "thresholdShiftMagnitudeMv",
      "Threshold-shift magnitude must be nonnegative.",
    );
  return {
    diblCoefficientMVPerV:
      input.thresholdShiftMagnitudeMv / input.drainVoltageChangeV,
  };
};

export const diblTool = createSimpleTool({
  calculate: (input) =>
    calculateDibl({
      drainVoltageChangeV: input.drainVoltageChangeV as number,
      thresholdShiftMagnitudeMv: input.thresholdShiftMagnitudeMv as number,
    }),
  description:
    "Compute the DIBL coefficient from the threshold voltage shift and the drain voltage change.",
  id: "semiconductor/mosfet-drain-induced-barrier-lowering",
  inputs: [
    {
      description:
        "Difference between the two drain voltages used for the measurement.",
      format: "voltage-v",
      id: "drainVoltageChangeV",
      kind: "number",
      label: "Drain-voltage change",
      minimum: Number.MIN_VALUE,
      unit: "V",
    },
    {
      description: "Threshold voltage shift caused by DIBL.",
      format: "voltage-mv",
      id: "thresholdShiftMagnitudeMv",
      kind: "number",
      label: "Threshold-shift magnitude",
      minimum: 0,
      unit: "mV",
    },
  ],
  outputs: [
    {
      description: "DIBL coefficient in millivolts per volt of drain voltage.",
      format: "factor",
      id: "diblCoefficientMVPerV",
      kind: "number",
      label: "DIBL coefficient",
      minimum: 0,
      unit: "mV/V",
    },
  ],
  title: "DIBL Coefficient Calculator",
});
export const runDibl = diblTool.execute;
export default diblTool;
