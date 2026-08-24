import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HciSubstrateCurrentInput = {
  readonly characteristicVolts?: number;
  readonly coefficientNanoAmpsPerMilliamp?: number;
  readonly drainCurrentMilliamps: number;
  readonly drainVolts: number;
  readonly saturationVolts: number;
};

export type HciSubstrateCurrentOutput = {
  readonly substrateCurrentNanoA: number;
};

export const hciSubstrateCurrentExample = {
  input: {
    characteristicVolts: 1.5,
    coefficientNanoAmpsPerMilliamp: 0.01,
    drainCurrentMilliamps: 1,
    drainVolts: 3,
    saturationVolts: 1.5,
  },
  output: { substrateCurrentNanoA: 0.0036787944117144234 },
} satisfies ToolExample<HciSubstrateCurrentInput, HciSubstrateCurrentOutput>;

export const hciSubstrateCurrentTool = createSimpleTool({
  calculate: (input) => {
    const characteristicVolts = input.characteristicVolts as number;
    const coefficientNanoAmpsPerMilliamp =
      input.coefficientNanoAmpsPerMilliamp as number;
    const drainCurrentMilliamps = input.drainCurrentMilliamps as number;
    const drainVolts = input.drainVolts as number;
    const saturationVolts = input.saturationVolts as number;
    if (!(drainVolts > saturationVolts))
      simpleError(
        "drainVolts",
        "Drain voltage must strictly exceed saturation voltage.",
        "insufficient_drain_bias",
      );
    const substrateCurrentNanoA =
      coefficientNanoAmpsPerMilliamp *
      drainCurrentMilliamps *
      Math.exp(-characteristicVolts / (drainVolts - saturationVolts));
    if (!Number.isFinite(substrateCurrentNanoA))
      simpleError(
        "drainCurrentMilliamps",
        "The substrate current is too large to represent.",
      );
    if (substrateCurrentNanoA === 0 && drainCurrentMilliamps > 0)
      simpleError(
        "drainVolts",
        "The substrate current is too small to represent.",
        "numeric_underflow",
      );
    return { substrateCurrentNanoA };
  },
  description:
    "Evaluate a calibrated hot-carrier substrate-current model from drain current and drain overdrive above saturation.",
  id: "semiconductor/hci-substrate-current",
  inputs: [
    {
      id: "drainCurrentMilliamps",
      kind: "number",
      label: "Drain current",
      minimum: 0,
      unit: "mA",
    },
    {
      id: "drainVolts",
      kind: "number",
      label: "Drain voltage",
      unit: "V",
    },
    {
      id: "saturationVolts",
      kind: "number",
      label: "Saturation voltage",
      unit: "V",
    },
    {
      default: 0.01,
      description:
        "Calibrated current ratio expressed as nanoamperes of substrate current per milliampere of drain current.",
      id: "coefficientNanoAmpsPerMilliamp",
      kind: "number",
      label: "Proportionality coefficient",
      minimum: 0,
      unit: "nA/mA",
    },
    {
      default: 1.5,
      id: "characteristicVolts",
      kind: "number",
      label: "Characteristic voltage",
      minimum: Number.MIN_VALUE,
      unit: "V",
    },
  ],
  outputs: [
    {
      id: "substrateCurrentNanoA",
      kind: "number",
      label: "Substrate current",
      unit: "nA",
    },
  ],
  title: "HCI Substrate Current Calculator",
});
export const runHciSubstrateCurrent = hciSubstrateCurrentTool.execute;
export default hciSubstrateCurrentTool;
