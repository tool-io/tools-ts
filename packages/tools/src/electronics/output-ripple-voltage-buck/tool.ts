import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type OutputRippleVoltageBuckInput = {
  readonly outputCapacitanceUf: number;
  readonly rippleCurrentA: number;
  readonly switchingFreqKhz: number;
};

export type OutputRippleVoltageBuckOutput = {
  readonly outputRippleV: number;
};

export const outputRippleVoltageBuckExample = {
  input: { outputCapacitanceUf: 100, rippleCurrentA: 1, switchingFreqKhz: 100 },
  output: { outputRippleV: 0.0125 },
} satisfies ToolExample<
  OutputRippleVoltageBuckInput,
  OutputRippleVoltageBuckOutput
>;

export const outputRippleVoltageBuckTool = createSimpleTool({
  calculate: (input) => {
    const rippleCurrentA = input.rippleCurrentA as number;
    const switchingFreqKhz = input.switchingFreqKhz as number;
    const outputCapacitanceUf = input.outputCapacitanceUf as number;
    if (!(rippleCurrentA > 0))
      simpleError(
        "rippleCurrentA",
        "Ripple current must be positive.",
        "invalid_current",
      );
    if (!(switchingFreqKhz > 0))
      simpleError(
        "switchingFreqKhz",
        "Switching frequency must be positive.",
        "invalid_frequency",
      );
    if (!(outputCapacitanceUf > 0))
      simpleError(
        "outputCapacitanceUf",
        "Output capacitance must be positive.",
        "invalid_capacitance",
      );
    return {
      outputRippleV:
        rippleCurrentA /
        (8 * (switchingFreqKhz * 1e3) * (outputCapacitanceUf * 1e-6)),
    };
  },
  description:
    "Compute buck converter output ripple voltage in the ESR-less form dI_L / (8 x f x Cout).",
  id: "electronics/output-ripple-voltage-buck",
  inputs: [
    {
      id: "rippleCurrentA",
      kind: "number",
      label: "Inductor ripple current",
      unit: "A",
    },
    {
      id: "switchingFreqKhz",
      kind: "number",
      label: "Switching frequency",
      unit: "kHz",
    },
    {
      id: "outputCapacitanceUf",
      kind: "number",
      label: "Output capacitance",
      unit: "uF",
    },
  ],
  outputs: [
    {
      id: "outputRippleV",
      kind: "number",
      label: "Output ripple voltage",
      unit: "V",
    },
  ],
  title: "Output Ripple Buck",
});
export const runOutputRippleVoltageBuck = outputRippleVoltageBuckTool.execute;
export default outputRippleVoltageBuckTool;
