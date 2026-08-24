import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type KinkEffectFloatingBodyInput = {
  readonly bodyCoefficientMillivoltsPerVolt: number;
  readonly drainVolts: number;
  readonly saturationVolts: number;
};

export type KinkEffectFloatingBodyOutput = {
  readonly kinkShiftMillivolts: number;
};

export const kinkEffectFloatingBodyExample = {
  input: {
    bodyCoefficientMillivoltsPerVolt: 30,
    drainVolts: 1.2,
    saturationVolts: 0.7,
  },
  output: { kinkShiftMillivolts: 15 },
} satisfies ToolExample<
  KinkEffectFloatingBodyInput,
  KinkEffectFloatingBodyOutput
>;

export const kinkEffectFloatingBodyTool = createSimpleTool({
  calculate: (input) => {
    const bodyCoefficientMillivoltsPerVolt =
      input.bodyCoefficientMillivoltsPerVolt as number;
    const drainVolts = input.drainVolts as number;
    const saturationVolts = input.saturationVolts as number;
    if (!(drainVolts >= 0))
      simpleError(
        "drainVolts",
        "Drain voltage must be zero or greater.",
        "insufficient_drain_bias",
      );
    if (!(saturationVolts >= 0))
      simpleError("saturationVolts", "Saturation voltage must be nonnegative.");
    if (!(bodyCoefficientMillivoltsPerVolt >= 0))
      simpleError(
        "bodyCoefficientMillivoltsPerVolt",
        "Body coefficient must be nonnegative.",
      );
    return {
      kinkShiftMillivolts:
        bodyCoefficientMillivoltsPerVolt *
        Math.max(0, drainVolts - saturationVolts),
    };
  },
  description:
    "Estimate the floating-body kink threshold-voltage shift from the excess drain bias beyond saturation.",
  id: "semiconductor/kink-effect-floating-body",
  inputs: [
    {
      description: "Kink shift per volt of excess drain bias.",
      id: "bodyCoefficientMillivoltsPerVolt",
      kind: "number",
      label: "Body coefficient",
      minimum: 0,
      unit: "mV/V",
    },
    {
      description: "Drain voltage of the floating-body device.",
      id: "drainVolts",
      kind: "number",
      label: "Drain voltage",
      minimum: 0,
      unit: "V",
    },
    {
      description: "Drain saturation voltage of the device.",
      id: "saturationVolts",
      kind: "number",
      label: "Saturation voltage",
      minimum: 0,
      unit: "V",
    },
  ],
  outputs: [
    {
      description: "Kink-induced threshold voltage shift.",
      format: "voltage-mv",
      id: "kinkShiftMillivolts",
      kind: "number",
      label: "Kink shift",
      minimum: 0,
      unit: "mV",
    },
  ],
  title: "Floating Body Kink Shift Calculator",
});
export const runKinkEffectFloatingBody = kinkEffectFloatingBodyTool.execute;
export default kinkEffectFloatingBodyTool;
