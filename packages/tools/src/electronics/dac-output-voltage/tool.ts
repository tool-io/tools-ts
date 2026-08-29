import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: { referenceVoltageV: 4.096, bits: 12, code: 2048 },
  output: { outputVoltageV: 2.048 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/dac-output-voltage",
  title: "Ideal DAC Output Voltage",
  description:
    "Calculate an ideal unipolar DAC code's voltage as Vref×code/2^N. The top code is one LSB below Vref; this does not include offset, gain, or integral nonlinearity.",
  inputs: [
    {
      id: "referenceVoltageV",
      kind: "number",
      label: "Reference voltage (V)",
      minimum: 0,
    },
    { id: "bits", kind: "integer", label: "Resolution (bits)", minimum: 1 },
    { id: "code", kind: "integer", label: "Digital code", minimum: 0 },
  ],
  outputs: [
    { id: "outputVoltageV", kind: "number", label: "Output Voltage V" },
  ],
  calculate: (input) => {
    const i = input as Record<string, number>;
    if (i.bits > 52 || i.code >= Math.pow(2, i.bits))
      simpleError(
        "code",
        "Code must be within the selected bit width (at most 52 bits).",
      );
    const output = {
      outputVoltageV: (i.referenceVoltageV * i.code) / Math.pow(2, i.bits),
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type DacOutputVoltageInput = Readonly<typeof example.input>;
export type DacOutputVoltageOutput = Readonly<typeof example.output>;
export const dacOutputVoltageTool = tool;
export const runDacOutputVoltage = tool.execute;
export default tool;
