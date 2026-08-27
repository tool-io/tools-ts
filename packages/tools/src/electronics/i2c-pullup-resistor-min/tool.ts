import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const i2cPullupResistorMinExample = {
  input: { sinkCurrentMa: 3, vddVolts: 5, volMaxV: 0.4 },
} satisfies ToolExample<{
  readonly sinkCurrentMa: number;
  readonly vddVolts: number;
  readonly volMaxV: number;
}>;

export const i2cPullupResistorMinTool = createSimpleTool({
  id: "electronics/i2c-pullup-resistor-min",
  title: "I2C Pullup Min",
  description:
    "Compute the minimum I2C pull-up resistance from VDD, the maximum output low voltage, and the sink current.",
  inputs: [
    { id: "vddVolts", label: "VDD", kind: "number", unit: "V" },
    {
      default: 0.4,
      id: "volMaxV",
      label: "Maximum output low voltage",
      kind: "number",
      unit: "V",
    },
    {
      default: 3,
      id: "sinkCurrentMa",
      label: "Sink current",
      kind: "number",
      unit: "mA",
    },
  ],
  outputs: [
    {
      id: "minPullupOhms",
      label: "Minimum pull-up resistance",
      kind: "number",
      unit: "\u03a9",
    },
  ],
  calculate: (input) => {
    const vddVolts = input.vddVolts as number;
    const volMaxV = input.volMaxV as number;
    const sinkCurrentMa = input.sinkCurrentMa as number;
    if (!(sinkCurrentMa > 0))
      simpleError(
        "sinkCurrentMa",
        "Sink current must be positive.",
        "invalid_current",
      );
    if (!(vddVolts > volMaxV))
      simpleError(
        "vddVolts",
        "VDD must exceed the maximum output low voltage.",
        "invalid_levels",
      );
    return {
      minPullupOhms: ((vddVolts - volMaxV) / sinkCurrentMa) * 1000,
    };
  },
});
export const runI2cPullupResistorMin = i2cPullupResistorMinTool.execute;
export default i2cPullupResistorMinTool;
